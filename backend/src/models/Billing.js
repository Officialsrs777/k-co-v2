import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; 

const Billing = sequelize.define(
  "Billing",
  {
    AvailabilityZone: { type: DataTypes.STRING, allowNull: true },
    BilledCost: { type: DataTypes.FLOAT, allowNull: true },
    BillingAccountId: { type: DataTypes.STRING, allowNull: true },
    BillingAccountName: { type: DataTypes.STRING, allowNull: true },
    BillingCurrency: { type: DataTypes.STRING, allowNull: true },
    BillingPeriodEnd: { type: DataTypes.DATE, allowNull: true },
    BillingPeriodStart: { type: DataTypes.DATE, allowNull: true },
    ChargeCategory: { type: DataTypes.STRING, allowNull: true },
    ChargeClass: { type: DataTypes.STRING, allowNull: true },
    ChargeDescription: { type: DataTypes.STRING, allowNull: true },
    ChargeFrequency: { type: DataTypes.STRING, allowNull: true },
    ChargePeriodEnd: { type: DataTypes.DATE, allowNull: true },
    ChargePeriodStart: { type: DataTypes.DATE, allowNull: true },
    CommitmentDiscountCategory: { type: DataTypes.STRING, allowNull: true },
    CommitmentDiscountId: { type: DataTypes.STRING, allowNull: true },
    CommitmentDiscountName: { type: DataTypes.STRING, allowNull: true },
    CommitmentDiscountStatus: { type: DataTypes.STRING, allowNull: true },
    CommitmentDiscountType: { type: DataTypes.STRING, allowNull: true },
    ConsumedQuantity: { type: DataTypes.FLOAT, allowNull: true },
    ConsumedUnit: { type: DataTypes.STRING, allowNull: true },
    ContractedCost: { type: DataTypes.FLOAT, allowNull: true },
    ContractedUnitPrice: { type: DataTypes.FLOAT, allowNull: true },
    EffectiveCost: { type: DataTypes.FLOAT, allowNull: true },
    InvoiceIssuerName: { type: DataTypes.STRING, allowNull: true },
    ListCost: { type: DataTypes.FLOAT, allowNull: true },
    ListUnitPrice: { type: DataTypes.FLOAT, allowNull: true },

    PricingCategory: { type: DataTypes.STRING, allowNull: true },
    PricingQuantity: { type: DataTypes.FLOAT, allowNull: true },
    PricingUnit: { type: DataTypes.STRING, allowNull: true },
    ProviderName: { type: DataTypes.STRING, allowNull: true },
    PublisherName: { type: DataTypes.STRING, allowNull: true },
    RegionId: { type: DataTypes.STRING, allowNull: true },
    RegionName: { type: DataTypes.STRING, allowNull: true },
    ResourceId: { type: DataTypes.STRING, allowNull: true },
    ResourceName: { type: DataTypes.STRING, allowNull: true },
    ResourceType: { type: DataTypes.STRING, allowNull: true },
    ServiceCategory: { type: DataTypes.STRING, allowNull: true },
    Id: { type: DataTypes.STRING, allowNull: true, primaryKey: true },
    ServiceName: { type: DataTypes.STRING, allowNull: true },
    SkuId: { type: DataTypes.STRING, allowNull: true },
    SkuPriceId: { type: DataTypes.STRING, allowNull: true },
    SubAccountId: { type: DataTypes.STRING, allowNull: true },
    SubAccountName: { type: DataTypes.STRING, allowNull: true },
    Tags: { type: DataTypes.JSON, allowNull: true }, // storing as JSON
  },
  {
    tableName: "Billing",
    timestamps: false,
  }
);

export default Billing;
