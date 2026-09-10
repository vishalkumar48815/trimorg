import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { RequestUser } from '../common/request-user.type';
import type { PaymentsQueryInput, RecordPaymentInput } from './payments.schemas';
import type {
  DueInvoiceItem,
  PaymentListItem,
  PaymentsResponse,
} from './payments.types';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPayments(
    user: RequestUser,
    query: PaymentsQueryInput,
  ): Promise<PaymentsResponse> {
    const organizationId = this.requireOrganizationId(user);
    const search = query.search?.trim();

    const where: Prisma.PaymentWhereInput = {
      organizationId,
      ...(query.paymentMethod ? { paymentMethod: query.paymentMethod } : {}),
      ...(search
        ? {
            OR: [
              { paymentNumber: { contains: search, mode: 'insensitive' } },
              { transactionRef: { contains: search, mode: 'insensitive' } },
              { customer: { name: { contains: search, mode: 'insensitive' } } },
              { sale: { saleNumber: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

    const [payments, todayPaymentsAgg, allCompletedSales] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          customer: { select: { name: true, mobile: true } },
          sale: { select: { saleNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.aggregate({
        where: {
          organizationId,
          createdAt: { gte: startOfToday },
        },
        _sum: { amount: true },
      }),
      this.prisma.sale.findMany({
        where: {
          organizationId,
          status: 'COMPLETED',
          type: 'INVOICE',
        },
        select: {
          grandTotal: true,
          paidAmount: true,
        },
      }),
    ]);

    let totalCollected = 0;
    const paymentItems: PaymentListItem[] = payments.map((p) => {
      const amt = Number(p.amount);
      totalCollected += amt;
      return {
        id: p.id,
        paymentNumber: p.paymentNumber,
        saleId: p.saleId,
        saleNumber: p.sale?.saleNumber ?? null,
        customerId: p.customerId,
        customerName: p.customer?.name ?? 'Walk-in Customer',
        customerMobile: p.customer?.mobile ?? null,
        amount: amt,
        paymentMethod: p.paymentMethod,
        transactionRef: p.transactionRef,
        notes: p.notes,
        createdAt: p.createdAt.toISOString(),
      };
    });

    let totalOutstandingDue = 0;
    for (const sale of allCompletedSales) {
      const due = Number(sale.grandTotal) - Number(sale.paidAmount);
      if (due > 0) {
        totalOutstandingDue += due;
      }
    }

    return {
      summary: {
        totalCollected: Number(totalCollected.toFixed(2)),
        todayCollected: Number((todayPaymentsAgg._sum.amount ?? 0).toFixed(2)),
        totalOutstandingDue: Number(totalOutstandingDue.toFixed(2)),
        totalTransactionsCount: payments.length,
      },
      payments: paymentItems,
    };
  }

  async getDueInvoices(user: RequestUser): Promise<DueInvoiceItem[]> {
    const organizationId = this.requireOrganizationId(user);

    const sales = await this.prisma.sale.findMany({
      where: {
        organizationId,
        status: 'COMPLETED',
        type: 'INVOICE',
      },
      include: {
        customer: { select: { name: true, mobile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const dueInvoices: DueInvoiceItem[] = [];

    for (const sale of sales) {
      const grandTotal = Number(sale.grandTotal);
      const paidAmount = Number(sale.paidAmount);
      const dueAmount = grandTotal - paidAmount;

      if (dueAmount > 0) {
        dueInvoices.push({
          id: sale.id,
          saleNumber: sale.saleNumber,
          customerId: sale.customerId,
          customerName: sale.customer?.name ?? 'Walk-in Customer',
          customerMobile: sale.customer?.mobile ?? null,
          grandTotal,
          paidAmount,
          dueAmount: Number(dueAmount.toFixed(2)),
          status: sale.status,
          createdAt: sale.createdAt.toISOString(),
        });
      }
    }

    return dueInvoices;
  }

  async recordPayment(
    user: RequestUser,
    input: RecordPaymentInput,
  ): Promise<PaymentListItem> {
    const organizationId = this.requireOrganizationId(user);

    const payment = await this.prisma.$transaction(async (tx) => {
      let customerId = input.customerId;

      if (input.saleId) {
        const sale = await tx.sale.findFirst({
          where: { id: input.saleId, organizationId },
        });

        if (!sale) {
          throw new NotFoundException({
            code: 'SaleNotFound',
            message: 'Invoice not found.',
          });
        }

        const currentPaid = Number(sale.paidAmount);
        const grandTotal = Number(sale.grandTotal);
        const newPaid = currentPaid + input.amount;

        if (newPaid > grandTotal + 0.01) {
          throw new BadRequestException({
            code: 'ExcessPaymentAmount',
            message: `Payment amount (${input.amount}) exceeds remaining invoice due (${(grandTotal - currentPaid).toFixed(2)}).`,
          });
        }

        await tx.sale.update({
          where: { id: sale.id },
          data: { paidAmount: newPaid },
        });

        if (!customerId && sale.customerId) {
          customerId = sale.customerId;
        }
      }

      const totalPaymentsCount = await tx.payment.count({ where: { organizationId } });
      const paymentNumber = `PAY-${(totalPaymentsCount + 1).toString().padStart(4, '0')}`;

      const created = await tx.payment.create({
        data: {
          organizationId,
          saleId: input.saleId,
          customerId,
          paymentNumber,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          transactionRef: input.transactionRef,
          notes: input.notes,
        },
        include: {
          customer: { select: { name: true, mobile: true } },
          sale: { select: { saleNumber: true } },
        },
      });

      return created;
    });

    return {
      id: payment.id,
      paymentNumber: payment.paymentNumber,
      saleId: payment.saleId,
      saleNumber: payment.sale?.saleNumber ?? null,
      customerId: payment.customerId,
      customerName: payment.customer?.name ?? 'Walk-in Customer',
      customerMobile: payment.customer?.mobile ?? null,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod,
      transactionRef: payment.transactionRef,
      notes: payment.notes,
      createdAt: payment.createdAt.toISOString(),
    };
  }

  private requireOrganizationId(user: RequestUser): string {
    if (!user.organizationId) {
      throw new BadRequestException({
        code: 'OrganizationRequired',
        message: 'Organization is required.',
      });
    }

    return user.organizationId;
  }
}
