import { BadRequestException, Injectable } from '@nestjs/common';
import type { Organization } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateOrganizationInput, UpdatePreferencesInput } from './organization.schemas';

export interface OrganizationProfile {
  id: string;
  businessName: string;
  businessType: string;
  gst: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  currencyCode: string | null;
  timezone: string | null;
  logoUrl: string | null;
  logoFileName: string | null;
  logoMimeType: string | null;
}

export interface StorePreferences {
  invoicePrefix: string;
  quotationPrefix: string;
  purchasePrefix: string;
  receiptPaperWidth: string;
  defaultTaxRate: number;
  financialYearStartMonth: number;
  currencyCode: string;
}

function serializeOrganization(organization: Organization): OrganizationProfile {
  return {
    id: organization.id,
    businessName: organization.businessName,
    businessType: organization.businessType,
    gst: organization.gst,
    addressLine1: organization.addressLine1,
    addressLine2: organization.addressLine2,
    city: organization.city,
    state: organization.state,
    postalCode: organization.postalCode,
    country: organization.country,
    currencyCode: organization.currencyCode,
    timezone: organization.timezone,
    logoUrl: organization.logoUrl,
    logoFileName: organization.logoFileName,
    logoMimeType: organization.logoMimeType,
  };
}

function serializePreferences(organization: Organization): StorePreferences {
  return {
    invoicePrefix: organization.invoicePrefix ?? 'INV-',
    quotationPrefix: organization.quotationPrefix ?? 'QT-',
    purchasePrefix: organization.purchasePrefix ?? 'PO-',
    receiptPaperWidth: organization.receiptPaperWidth ?? '80MM',
    defaultTaxRate: Number(organization.defaultTaxRate ?? 18),
    financialYearStartMonth: organization.financialYearStartMonth ?? 4,
    currencyCode: organization.currencyCode ?? 'INR',
  };
}

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getForUser(userId: string): Promise<OrganizationProfile> {
    const organization = await this.requireOrganization(userId);
    return serializeOrganization(organization);
  }

  async updateForUser(
    userId: string,
    input: UpdateOrganizationInput,
  ): Promise<OrganizationProfile> {
    const organization = await this.requireOrganization(userId);

    const updated = await this.prisma.organization.update({
      where: { id: organization.id },
      data: {
        businessName: input.businessName,
        businessType: input.businessType,
        gst: input.gst && input.gst.length > 0 ? input.gst : null,
        addressLine1: input.addressLine1,
        addressLine2:
          input.addressLine2 && input.addressLine2.length > 0 ? input.addressLine2 : null,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        currencyCode: input.currencyCode,
        timezone: input.timezone,
        logoUrl:
          input.logoDataUrl && input.logoDataUrl.length > 0
            ? input.logoDataUrl
            : organization.logoUrl,
        logoFileName:
          input.logoFileName && input.logoFileName.length > 0
            ? input.logoFileName
            : organization.logoFileName,
        logoMimeType:
          input.logoMimeType && input.logoMimeType.length > 0
            ? input.logoMimeType
            : organization.logoMimeType,
      },
    });

    return serializeOrganization(updated);
  }

  async getPreferences(userId: string): Promise<StorePreferences> {
    const organization = await this.requireOrganization(userId);
    return serializePreferences(organization);
  }

  async updatePreferences(
    userId: string,
    input: UpdatePreferencesInput,
  ): Promise<StorePreferences> {
    const organization = await this.requireOrganization(userId);

    const updated = await this.prisma.organization.update({
      where: { id: organization.id },
      data: {
        invoicePrefix: input.invoicePrefix,
        quotationPrefix: input.quotationPrefix,
        purchasePrefix: input.purchasePrefix,
        receiptPaperWidth: input.receiptPaperWidth,
        defaultTaxRate: input.defaultTaxRate,
        financialYearStartMonth: input.financialYearStartMonth,
        currencyCode: input.currencyCode,
      },
    });

    return serializePreferences(updated);
  }

  private async requireOrganization(userId: string): Promise<Organization> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user?.organization) {
      throw new BadRequestException({
        code: 'OrganizationMissing',
        message: 'No organization found for this account.',
      });
    }

    return user.organization;
  }
}
