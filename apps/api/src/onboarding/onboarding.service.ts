import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationStatus, type Organization } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type {
  AddressStepInput,
  BusinessStepInput,
  LogoStepInput,
  OrganizationStepInput,
  PreferencesStepInput,
} from './onboarding.schemas';

interface OnboardingOrganization {
  id: string;
  businessName: string;
  businessType: string;
  ownerName: string;
  mobile: string;
  gst: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  currencyCode: string | null;
  timezone: string | null;
  financialYearStartMonth: number | null;
  logoUrl: string | null;
  logoMimeType: string | null;
  logoFileName: string | null;
  status: string;
  onboardingCompletedAt: Date | null;
}

export interface OnboardingStatus {
  hasOrganization: boolean;
  isComplete: boolean;
  currentStep: 1 | 2 | 3 | 4 | 5;
  organization: OnboardingOrganization | null;
}

function serializeOrganization(organization: Organization): OnboardingOrganization {
  return {
    id: organization.id,
    businessName: organization.businessName,
    businessType: organization.businessType,
    ownerName: organization.ownerName,
    mobile: organization.mobile,
    gst: organization.gst,
    addressLine1: organization.addressLine1,
    addressLine2: organization.addressLine2,
    city: organization.city,
    state: organization.state,
    postalCode: organization.postalCode,
    country: organization.country,
    currencyCode: organization.currencyCode,
    timezone: organization.timezone,
    financialYearStartMonth: organization.financialYearStartMonth,
    logoUrl: organization.logoUrl,
    logoMimeType: organization.logoMimeType,
    logoFileName: organization.logoFileName,
    status: organization.status,
    onboardingCompletedAt: organization.onboardingCompletedAt,
  };
}

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string): Promise<OnboardingStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'UserNotFound',
        message: 'User not found.',
      });
    }

    const organization = user.organization;
    const isComplete = Boolean(user.onboardingCompletedAt && organization?.status === OrganizationStatus.ACTIVE);

    return {
      hasOrganization: Boolean(organization),
      isComplete,
      currentStep: this.resolveCurrentStep(organization, isComplete),
      organization: organization ? serializeOrganization(organization) : null,
    };
  }

  async saveBusinessStep(userId: string, input: BusinessStepInput): Promise<OnboardingStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user?.organization) {
      throw new BadRequestException({
        code: 'OrganizationMissing',
        message: 'Create your organization first.',
      });
    }

    await this.prisma.organization.update({
      where: { id: user.organization.id },
      data: {
        businessName: input.businessName,
        businessType: input.businessType,
      },
    });

    return this.buildStatus(userId);
  }

  async saveOrganizationStep(userId: string, input: OrganizationStepInput): Promise<OnboardingStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'UserNotFound',
        message: 'User not found.',
      });
    }

    if (user.organization) {
      await this.prisma.organization.update({
        where: { id: user.organization.id },
        data: {
          businessName: input.businessName,
          businessType: input.businessType,
          ownerName: input.ownerName,
          mobile: input.mobile,
          gst: input.gst && input.gst.length > 0 ? input.gst : null,
        },
      });
    } else {
      await this.prisma.$transaction(async (tx) => {
        const created = await tx.organization.create({
          data: {
            businessName: input.businessName,
            businessType: input.businessType,
            ownerName: input.ownerName,
            mobile: input.mobile,
            gst: input.gst && input.gst.length > 0 ? input.gst : null,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: { organizationId: created.id },
        });
      });
    }

    return this.buildStatus(userId);
  }

  async saveAddressStep(userId: string, input: AddressStepInput): Promise<OnboardingStatus> {
    const organization = await this.requireOrganization(userId);

    await this.prisma.organization.update({
      where: { id: organization.id },
      data: {
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2 && input.addressLine2.length > 0 ? input.addressLine2 : null,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
      },
    });

    return this.buildStatus(userId);
  }

  async savePreferencesStep(userId: string, input: PreferencesStepInput): Promise<OnboardingStatus> {
    const organization = await this.requireOrganization(userId);

    await this.prisma.$transaction([
      this.prisma.organization.update({
        where: { id: organization.id },
        data: {
          currencyCode: input.currencyCode,
          timezone: input.timezone,
          financialYearStartMonth: input.financialYearStartMonth,
          status: OrganizationStatus.ACTIVE,
          onboardingCompletedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          onboardingCompletedAt: new Date(),
        },
      }),
    ]);

    return this.buildStatus(userId);
  }

  async saveLogoStep(userId: string, input: LogoStepInput): Promise<OnboardingStatus> {
    const organization = await this.requireOrganization(userId);

    await this.prisma.organization.update({
      where: { id: organization.id },
      data: {
        logoUrl: input.logoDataUrl && input.logoDataUrl.length > 0 ? input.logoDataUrl : null,
        logoFileName: input.logoFileName && input.logoFileName.length > 0 ? input.logoFileName : null,
        logoMimeType: input.logoMimeType && input.logoMimeType.length > 0 ? input.logoMimeType : null,
      },
    });

    return this.buildStatus(userId);
  }

  async complete(userId: string): Promise<OnboardingStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user?.organization) {
      throw new BadRequestException({
        code: 'OrganizationMissing',
        message: 'Create your organization before finishing onboarding.',
      });
    }

    const organization = user.organization;

    if (
      !organization.businessName ||
      !organization.businessType ||
      organization.businessType === 'Pending' ||
      !organization.ownerName ||
      !organization.mobile ||
      !organization.addressLine1 ||
      !organization.city ||
      !organization.state ||
      !organization.postalCode ||
      !organization.country ||
      !organization.currencyCode ||
      !organization.timezone ||
      !organization.financialYearStartMonth
    ) {
      throw new BadRequestException({
        code: 'OnboardingIncomplete',
        message: 'Complete all onboarding steps before finishing.',
      });
    }

    await this.prisma.$transaction([
      this.prisma.organization.update({
        where: { id: organization.id },
        data: {
          status: OrganizationStatus.ACTIVE,
          onboardingCompletedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: { id: userId },
        data: {
          onboardingCompletedAt: new Date(),
        },
      }),
    ]);

    return this.buildStatus(userId);
  }

  private async requireOrganization(userId: string): Promise<Organization> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user?.organization) {
      throw new BadRequestException({
        code: 'OrganizationMissing',
        message: 'Create your organization first.',
      });
    }

    return user.organization;
  }

  private async buildStatus(userId: string): Promise<OnboardingStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { organization: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'UserNotFound',
        message: 'User not found.',
      });
    }

    return {
      hasOrganization: Boolean(user.organization),
      isComplete: Boolean(user.onboardingCompletedAt && user.organization?.status === OrganizationStatus.ACTIVE),
      currentStep: this.resolveCurrentStep(user.organization ?? null, Boolean(user.onboardingCompletedAt)),
      organization: user.organization ? serializeOrganization(user.organization) : null,
    };
  }

  private resolveCurrentStep(
    organization: Organization | null,
    isComplete: boolean,
  ): 1 | 2 | 3 | 4 | 5 {
    if (isComplete) {
      return 5;
    }

    if (!organization) {
      return 1;
    }

    if (organization.businessType === 'Pending') {
      return 1;
    }

    if (
      !organization.addressLine1 ||
      !organization.city ||
      !organization.state ||
      !organization.postalCode ||
      !organization.country
    ) {
      return 2;
    }

    if (!organization.currencyCode || !organization.timezone || !organization.financialYearStartMonth) {
      return 3;
    }

    return 4;
  }
}
