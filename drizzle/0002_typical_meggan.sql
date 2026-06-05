CREATE TABLE "Bank" (
	"BankID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Bank_BankID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CompanyID" integer,
	"BankName" varchar(255),
	"AccountNo" varchar(255),
	"IFSCCode" varchar(50),
	"SwiftCode" varchar(100),
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"CategoryID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Category_CategoryID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CompanyID" integer,
	"CategoryName" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Company" (
	"CompanyID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Company_CompanyID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"Name" varchar(255) NOT NULL,
	"Address" text,
	"GSTIN" varchar(50),
	"PANNo" varchar(50),
	"Phone1" varchar(50),
	"Phone2" varchar(50),
	"state" varchar(100),
	"Statecode" integer,
	"EmailID1" varchar(255),
	"EmailID2" varchar(255),
	"Website" varchar(255),
	"VATno" integer,
	"CSTNo" integer,
	"ECCNo" varchar(100),
	"IECCode" varchar(100),
	"SupplyFrom" varchar(255),
	"FinancialYear" varchar(100),
	"StartDate" timestamp,
	"EndDate" timestamp,
	"SalesInvoiceStarts" varchar(100),
	"ServiceInvoiceStarts" varchar(100),
	"ProformaSalesInvoiceStarts" varchar(100),
	"ProformaServiceInvoiceStarts" varchar(100),
	"SalesInvoicePrefix" varchar(50),
	"ServiceInvoicePrefix" varchar(50),
	"ProformaSalesInvoicePrefix" varchar(50),
	"ProformaServiceInvoicePrefix" varchar(50),
	"QuotationStarts" varchar(100),
	"QuotationPrefix" varchar(50),
	"ProposalStarts" varchar(100),
	"ProposalPrefix" varchar(50),
	"ISOText" text,
	"Loc" varchar(255),
	"Pin" varchar(50),
	"SignatureImage" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "FinancialSettings" (
	"FinancialYearID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "FinancialSettings_FinancialYearID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CompanyID" integer,
	"FinancialYear" varchar(100),
	"StartDate" timestamp,
	"EndDate" timestamp,
	"SalesInvoiceCount" varchar(100),
	"ServiceInvoiceCount" varchar(100),
	"ProformaSalesInvoiceCount" varchar(100),
	"ProformaServiceInvoiceCount" varchar(100),
	"QuotationCount" varchar(100),
	"ProposalCount" varchar(100),
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "GoodsInventory" (
	"InventoryID" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "GoodsInventory_InventoryID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"GoodsID" integer,
	"PartyName" varchar(255),
	"PartyOtherdetail" varchar(255),
	"InvDate" timestamp,
	"UMO" varchar(100),
	"Qty" numeric(15, 4),
	"PricePerUnit" numeric(15, 2),
	"TotalPrice" numeric(15, 2),
	"Remarks" text,
	"InventoryType" varchar(100),
	"Company" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "Goods" (
	"GoodsID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Goods_GoodsID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"TypeID" integer,
	"TypeName" varchar(255),
	"StockCategoryID" integer,
	"StockSubCategoryID" integer,
	"ModelName" varchar(255),
	"PlungerDiaName" varchar(255),
	"GoodsName" varchar(255),
	"Description" text,
	"UOM" varchar(100),
	"HSN" varchar(100),
	"GSTRate" numeric(5, 2),
	"AvgPricePerUnit" numeric(15, 2),
	"OpeningQTY" numeric(15, 4),
	"ClosingQTY" numeric(15, 4),
	"ClosingStockVal" numeric(15, 2),
	"ReOrderLevel" numeric(15, 4),
	"FullGoodsName" varchar(255),
	"LastUpdate" varchar(255),
	"Company" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "InvoiceDetail" (
	"InvoiceDetailID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "InvoiceDetail_InvoiceDetailID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"InvoiceID" integer,
	"ProductName" varchar(255),
	"Description" text,
	"HSNACS" varchar(100),
	"UOM" varchar(100),
	"Qty" numeric(15, 4),
	"Rate" numeric(15, 2),
	"IsService" varchar(50),
	"Amount" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DiscountVal" numeric(15, 2),
	"TaxableValue" numeric(15, 2),
	"CGSTRate" numeric(5, 2),
	"CGSTAmt" numeric(15, 2),
	"SGSTRate" numeric(5, 2),
	"SGSTAmt" numeric(15, 2),
	"IGSTRate" numeric(5, 2),
	"IGSTAmt" numeric(15, 2),
	"TotalAmount" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Invoice" (
	"InvoiceID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Invoice_InvoiceID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"InvoiceNo" text,
	"InvoiceDate" timestamp,
	"PartyID" integer,
	"ChallanNo" varchar(255),
	"ChallanDate" timestamp,
	"PartyDCNo" varchar(255),
	"PartyDCDate" timestamp,
	"PO" varchar(255),
	"PODate" timestamp,
	"ARNNo" varchar(255),
	"ARNDate" timestamp,
	"TransportationMode" varchar(255),
	"SupplyTo" varchar(255),
	"SupplyStateCode" integer,
	"ModelNo" varchar(255),
	"AgainstForm" varchar(255),
	"ReceiverName" varchar(255),
	"ReceiverAddress" text,
	"ReceiverGSTIN" varchar(100),
	"ReceiverState" varchar(100),
	"ReceiverStateCode" varchar(100),
	"ReceiverPanNo" varchar(100),
	"ConsigneeName" varchar(255),
	"ConsigneePartyID" integer,
	"ConsigneeAddress" text,
	"ConsigneeGSTIN" varchar(100),
	"ConsigneeState" varchar(100),
	"ConsigneeStateCode" varchar(100),
	"ConsigneePanNo" varchar(100),
	"IsSameAddress" boolean,
	"TotalAmtBeforeTax" numeric(15, 2),
	"PackingCharge" numeric(15, 2),
	"PCGSTRate" numeric(5, 2),
	"PCGSTAmt" numeric(15, 2),
	"PSGSTRate" numeric(5, 2),
	"PSGSTAmt" numeric(15, 2),
	"PIGSTRate" numeric(5, 2),
	"PIGSTAmt" numeric(15, 2),
	"CGST" numeric(15, 2),
	"SGST" numeric(15, 2),
	"IGST" numeric(15, 2),
	"TotalGSTTax" numeric(15, 2),
	"TotalAmtAfterTax" numeric(15, 2),
	"GSTReverseCharge" numeric(15, 2),
	"TotalInWords" text,
	"TaxInWords" text,
	"Remarks" text,
	"GrandTotalAmount" numeric(15, 2),
	"RoundOff" numeric(15, 2),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp,
	"Company" varchar(255),
	"InvoiceType" varchar(100),
	"QRCode" text,
	"IRNNo" varchar(255),
	"AckNo" varchar(255),
	"AckDate" varchar(255),
	"TransId" varchar(255),
	"TransName" varchar(255),
	"TransMode" varchar(255),
	"Distance" varchar(255),
	"VehNo" varchar(255),
	"VehType" varchar(255),
	"EwbNo" varchar(255),
	"EwbDt" varchar(255),
	"EwbValidTill" varchar(255),
	"CEWBNo" varchar(255),
	"MultiVehInfo" varchar(255),
	"PlaceOfDel" varchar(255),
	"ShipPin" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "MOC" (
	"MOCID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "MOC_MOCID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"MOCName" varchar(255) NOT NULL,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Model" (
	"ModelID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Model_ModelID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ModelName" varchar(255) NOT NULL,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Party" (
	"PartyID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Party_PartyID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"PartyName" varchar(255) NOT NULL,
	"ContactPerson" varchar(255),
	"Contact1" varchar(100),
	"Contact2" varchar(100),
	"Address" text,
	"City" varchar(100),
	"State" varchar(100),
	"Country" varchar(100),
	"StateCode" integer,
	"Email" varchar(255),
	"Website" varchar(255),
	"GSTStatus" varchar(100),
	"GSTIN" varchar(50),
	"PANNo" varchar(50),
	"VATNo" integer,
	"CSTNo" integer,
	"ECCNo" varchar(100),
	"IECCode" varchar(100),
	"Company" varchar(255),
	"Pin" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "PlungerDia" (
	"PlungerDiaID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PlungerDia_PlungerDiaID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"PlungerDiaName" varchar(255) NOT NULL,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "POProduct" (
	"POProductID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "POProduct_POProductID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CategoryID" integer,
	"SubCategoryID" integer,
	"ProductName" varchar(255) NOT NULL,
	"UOM" varchar(100),
	"HSNNoOrSACNo" varchar(100),
	"MachineNo" varchar(100),
	"Price" numeric(15, 2),
	"FullProductName" varchar(255),
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Product" (
	"ProductID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Product_ProductID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CategoryID" integer,
	"SubCategoryID" integer,
	"ProductName" varchar(255) NOT NULL,
	"UOM" varchar(100),
	"HSNNoOrSACNo" varchar(100),
	"MachineNo" varchar(100),
	"Price" numeric(15, 2),
	"FullProductName" varchar(255),
	"IsService" boolean,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProformaInvoiceDetail" (
	"ProformaInvoiceDetailID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProformaInvoiceDetail_ProformaInvoiceDetailID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ProformaInvoiceID" integer,
	"ProductName" varchar(255),
	"Description" text,
	"HSNACS" varchar(100),
	"UOM" varchar(100),
	"Qty" numeric(15, 4),
	"Rate" numeric(15, 2),
	"Amount" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DiscountVal" numeric(15, 2),
	"TaxableValue" numeric(15, 2),
	"CGSTRate" numeric(5, 2),
	"CGSTAmt" numeric(15, 2),
	"SGSTRate" numeric(5, 2),
	"SGSTAmt" numeric(15, 2),
	"IGSTRate" numeric(5, 2),
	"IGSTAmt" numeric(15, 2),
	"TotalAmount" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProformaInvoice" (
	"ProformaInvoiceID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProformaInvoice_ProformaInvoiceID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"InvoiceNo" varchar(255),
	"InvoiceDate" timestamp,
	"PartyID" integer,
	"PartyDCNo" varchar(255),
	"PartyDCDate" timestamp,
	"PO" varchar(255),
	"PODate" timestamp,
	"TransportationMode" varchar(255),
	"SupplyTo" varchar(255),
	"AgainstForm" varchar(255),
	"Packing" varchar(255),
	"ReceiverName" varchar(255),
	"ReceiverAddress" text,
	"ReceiverGSTIN" varchar(100),
	"ReceiverState" varchar(100),
	"ReceiverStateCode" varchar(100),
	"ReceiverPanNo" varchar(100),
	"ConsigneeName" varchar(255),
	"ConsigneePartyID" integer,
	"ConsigneeAddress" text,
	"ConsigneeGSTIN" varchar(100),
	"ConsigneeState" varchar(100),
	"ConsigneeStateCode" varchar(100),
	"ConsigneePanNo" varchar(100),
	"IsSameAddress" boolean,
	"TotalAmtBeforeTax" numeric(15, 2),
	"PackingCharge" numeric(15, 2),
	"PCGSTRate" numeric(5, 2),
	"PCGSTAmt" numeric(15, 2),
	"PSGSTRate" numeric(5, 2),
	"PSGSTAmt" numeric(15, 2),
	"PIGSTRate" numeric(5, 2),
	"PIGSTAmt" numeric(15, 2),
	"CGST" numeric(15, 2),
	"SGST" numeric(15, 2),
	"IGST" numeric(15, 2),
	"TotalGSTTax" numeric(15, 2),
	"TotalAmtAfterTax" numeric(15, 2),
	"GSTReverseCharge" numeric(15, 2),
	"TotalInWords" text,
	"TaxInWords" text,
	"Remarks" text,
	"GrandTotalAmount" numeric(15, 2),
	"RoundOff" numeric(15, 2),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp,
	"Company" varchar(255),
	"InvoiceType" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "ProformaServiceInvoiceDetail" (
	"ProformaServiceInvoiceDetailID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProformaServiceInvoiceDetail_ProformaServiceInvoiceDetailID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ProformaServiceInvoiceID" integer,
	"ProductName" varchar(255),
	"Description" text,
	"HSNACS" varchar(100),
	"UOM" varchar(100),
	"Qty" numeric(15, 4),
	"Rate" numeric(15, 2),
	"Amount" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DiscountVal" numeric(15, 2),
	"TaxableValue" numeric(15, 2),
	"CGSTRate" numeric(5, 2),
	"CGSTAmt" numeric(15, 2),
	"SGSTRate" numeric(5, 2),
	"SGSTAmt" numeric(15, 2),
	"IGSTRate" numeric(5, 2),
	"IGSTAmt" numeric(15, 2),
	"TotalAmount" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProformaServiceInvoice" (
	"ProformaServiceInvoiceID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProformaServiceInvoice_ProformaServiceInvoiceID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"InvoiceNo" varchar(255),
	"InvoiceDate" timestamp,
	"PartyID" integer,
	"PartyDCNo" varchar(255),
	"PartyDCDate" timestamp,
	"PO" varchar(255),
	"PODate" timestamp,
	"TransportationMode" varchar(255),
	"SupplyTo" varchar(255),
	"AgainstForm" varchar(255),
	"Packing" varchar(255),
	"ReceiverName" varchar(255),
	"ReceiverAddress" text,
	"ReceiverGSTIN" varchar(100),
	"ReceiverState" varchar(100),
	"ReceiverStateCode" varchar(100),
	"ReceiverPanNo" varchar(100),
	"ConsigneeName" varchar(255),
	"ConsigneePartyID" integer,
	"ConsigneeAddress" varchar(255),
	"ConsigneeGSTIN" varchar(100),
	"ConsigneeState" varchar(100),
	"ConsigneeStateCode" varchar(100),
	"ConsigneePanNo" varchar(100),
	"IsSameAddress" boolean,
	"TotalAmtBeforeTax" numeric(15, 2),
	"PackingCharge" numeric(15, 2),
	"PCGSTRate" numeric(5, 2),
	"PCGSTAmt" numeric(15, 2),
	"PSGSTRate" numeric(5, 2),
	"PSGSTAmt" numeric(15, 2),
	"PIGSTRate" numeric(5, 2),
	"PIGSTAmt" numeric(15, 2),
	"CGST" numeric(15, 2),
	"SGST" numeric(15, 2),
	"IGST" numeric(15, 2),
	"TotalGSTTax" numeric(15, 2),
	"TotalAmtAfterTax" numeric(15, 2),
	"GSTReverseCharge" numeric(15, 2),
	"TotalInWords" text,
	"TaxInWords" text,
	"Remarks" text,
	"GrandTotalAmount" numeric(15, 2),
	"RoundOff" numeric(15, 2),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp,
	"Company" varchar(255),
	"InvoiceType" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "ProposalCustomFields" (
	"FieldID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalCustomFields_FieldID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ProposalID" integer,
	"FieldName" varchar(255),
	"FieldValue" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "ProposalExtraProducts" (
	"ExtraProductID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalExtraProducts_ExtraProductID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ProposalID" integer,
	"SrNo" integer,
	"ProductName" varchar(255),
	"Price" numeric(15, 2),
	"Quantity" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProposalHistory" (
	"ProposalID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalHistory_ProposalID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ProposalNumber" varchar(255),
	"CompanyID" integer,
	"PartyID" integer,
	"ProductID" integer,
	"PumpTypeID" integer,
	"PumpModelID" integer,
	"PumpType" varchar(255),
	"PumpModel" varchar(255),
	"Price" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DeliveryTime" varchar(255),
	"ProposalDate" timestamp,
	"GeneratedBy" varchar(255),
	"Application" varchar(255),
	"FullProductName" varchar(255),
	"DischargeCapacity" varchar(255),
	"DischargePressure" varchar(255),
	"PumpSPM" varchar(255),
	"BlockMaterial" varchar(255),
	"ValveAssembly" varchar(255),
	"PlungerMaterial" varchar(255),
	"InletOutlet" varchar(255),
	"SuctionPressure" varchar(255),
	"MotorHP" varchar(255),
	"DriveDetails" varchar(255),
	"FormattedPrice" varchar(255),
	"PriceInWords" text,
	"ReferenceNo" varchar(255),
	"ReferenceDate" varchar(255),
	"InquiryNo" varchar(255),
	"InquiryDate" varchar(255),
	"BuyerName" varchar(255),
	"BuyerAddress" text,
	"BuyerGSTIN" varchar(100),
	"BuyerPANNo" varchar(100),
	"BuyerState" varchar(100),
	"BuyerStateCode" varchar(100),
	"KindlyAttentionTo" varchar(255),
	"MOCDetails" varchar(255),
	"HandlingMaterial" varchar(255),
	"Temperature" varchar(255),
	"PumpSetQuantity" integer,
	"MotorPrice" numeric(15, 2),
	"MotorQuantity" integer,
	"DiscountNote" varchar(255),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProposalScopeHistory" (
	"ScopeID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalScopeHistory_ScopeID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ProposalID" integer,
	"SrNo" integer,
	"Description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProposalScopeMaster" (
	"ScopeID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalScopeMaster_ScopeID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"Description" text
);
--> statement-breakpoint
CREATE TABLE "ProposalSignatory" (
	"SignatoryID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalSignatory_SignatoryID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"SignatoryName" varchar(255) NOT NULL,
	"MobileNo" varchar(100),
	"CompanyName" varchar(255),
	"CompanyID" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProposalTermsHistory" (
	"HistTermID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalTermsHistory_HistTermID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ProposalID" integer,
	"SrNo" integer,
	"TermText" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ProposalTermsMaster" (
	"TermID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ProposalTermsMaster_TermID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CompanyName" varchar(255),
	"TermText" text,
	"SrNo" integer,
	"IsDefault" integer
);
--> statement-breakpoint
CREATE TABLE "PumpModelMaster" (
	"PumpModelID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PumpModelMaster_PumpModelID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"PumpModelName" varchar(255) NOT NULL,
	"Company" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "PumpTypeMaster" (
	"PumpTypeID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PumpTypeMaster_PumpTypeID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"PumpTypeName" varchar(255) NOT NULL,
	"Company" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "PurchaseOrderDetail" (
	"PurchaseOrderDetailID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PurchaseOrderDetail_PurchaseOrderDetailID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"PurchaseOrderID" integer,
	"ProductName" varchar(255),
	"Description" text,
	"HSNACS" varchar(100),
	"UOM" varchar(100),
	"Qty" numeric(15, 4),
	"Rate" numeric(15, 2),
	"Amount" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DiscountVal" numeric(15, 2),
	"TaxableValue" numeric(15, 2),
	"CGSTRate" numeric(5, 2),
	"CGSTAmt" numeric(15, 2),
	"SGSTRate" numeric(5, 2),
	"SGSTAmt" numeric(15, 2),
	"IGSTRate" numeric(5, 2),
	"IGSTAmt" numeric(15, 2),
	"TotalAmount" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "PurchaseOrder" (
	"PurchaseOrderID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PurchaseOrder_PurchaseOrderID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"PO" varchar(255),
	"PODate" timestamp,
	"VendorID" integer,
	"DeliverySchedule" varchar(255),
	"QuotRef" varchar(255),
	"TransportorFOR" varchar(255),
	"PaymentDays" varchar(255),
	"AgainstForm" varchar(255),
	"ConsignorName" varchar(255),
	"ConsignorAddress" text,
	"ConsignorGSTIN" varchar(100),
	"ConsignorState" varchar(100),
	"ConsignorStateCode" varchar(100),
	"ConsignorPanNo" varchar(100),
	"TotalAmtBeforeTax" numeric(15, 2),
	"CGST" numeric(15, 2),
	"SGST" numeric(15, 2),
	"IGST" numeric(15, 2),
	"TotalGSTTax" numeric(15, 2),
	"TotalAmtAfterTax" numeric(15, 2),
	"GSTReverseCharge" numeric(15, 2),
	"TotalInWords" text,
	"TaxInWords" text,
	"Remarks" text,
	"GrandTotalAmount" numeric(15, 2),
	"RoundOff" numeric(15, 2),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp,
	"Company" varchar(255),
	"POType" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "QuotationDetail" (
	"QuotationDetailID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "QuotationDetail_QuotationDetailID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"QuotationID" integer,
	"ProductName" varchar(255),
	"CategoryID" integer,
	"Description" text,
	"HSNACS" varchar(100),
	"UOM" varchar(100),
	"Qty" numeric(15, 4),
	"Rate" numeric(15, 2),
	"Amount" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DiscountVal" numeric(15, 2),
	"TaxableValue" numeric(15, 2),
	"GSTRate" numeric(5, 2),
	"GSTAmt" numeric(15, 2),
	"TotalAmount" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Quotation" (
	"QuotationID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Quotation_QuotationID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"QuotationNo" text,
	"QuotationDate" timestamp,
	"PartyID" integer,
	"InquiryNo" varchar(255),
	"InquiryDate" timestamp,
	"PartyDCNo" varchar(255),
	"PartyDCDate" timestamp,
	"BuyerName" varchar(255),
	"BuyerAddress" text,
	"BuyerGSTIN" varchar(100),
	"BuyerState" varchar(100),
	"BuyerStateCode" varchar(100),
	"BuyerPanNo" varchar(100),
	"KindlyAttentionTo" text,
	"TotalAmtBeforeTax" numeric(15, 2),
	"GST" numeric(15, 2),
	"TotalGSTTax" numeric(15, 2),
	"TotalAmtAfterTax" numeric(15, 2),
	"TotalInWords" text,
	"TaxInWords" text,
	"Remarks" text,
	"GrandTotalAmount" numeric(15, 2),
	"RoundOff" numeric(15, 2),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"PreparedBy" varchar(255),
	"Mobile" varchar(100),
	"PackingCharge" text,
	"IsGST" boolean,
	"DeliveryTime" varchar(255),
	"NewFOR" varchar(255),
	"PaymentTerm" varchar(255),
	"Warranty" varchar(255),
	"Validity" varchar(255),
	"Company" varchar(255),
	"QuotationType" varchar(100),
	"FormType" varchar(100),
	"ModelNo" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "ServiceInvoiceDetail" (
	"ServiceInvoiceDetailID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ServiceInvoiceDetail_ServiceInvoiceDetailID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ServiceInvoiceID" integer,
	"ProductName" varchar(255),
	"Description" text,
	"HSNACS" varchar(100),
	"UOM" varchar(100),
	"Qty" numeric(15, 4),
	"Rate" numeric(15, 2),
	"IsService" varchar(50),
	"Amount" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DiscountVal" numeric(15, 2),
	"TaxableValue" numeric(15, 2),
	"CGSTRate" numeric(5, 2),
	"CGSTAmt" numeric(15, 2),
	"SGSTRate" numeric(5, 2),
	"SGSTAmt" numeric(15, 2),
	"IGSTRate" numeric(5, 2),
	"IGSTAmt" numeric(15, 2),
	"TotalAmount" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "ServiceInvoice" (
	"ServiceInvoiceID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ServiceInvoice_ServiceInvoiceID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"InvoiceNo" text,
	"InvoiceDate" timestamp,
	"PartyID" integer,
	"ChallanNo" varchar(255),
	"ChallanDate" timestamp,
	"PartyDCNo" varchar(255),
	"PartyDCDate" timestamp,
	"PO" varchar(255),
	"PODate" timestamp,
	"ARNNo" varchar(255),
	"ARNDate" timestamp,
	"TransportationMode" varchar(255),
	"SupplyTo" varchar(255),
	"SupplyStateCode" integer,
	"AgainstForm" varchar(255),
	"ReceiverName" varchar(255),
	"ReceiverAddress" text,
	"ReceiverGSTIN" varchar(100),
	"ReceiverState" varchar(100),
	"ReceiverStateCode" varchar(100),
	"ReceiverPanNo" varchar(100),
	"ConsigneeName" varchar(255),
	"ConsigneePartyID" integer,
	"ConsigneeAddress" text,
	"ConsigneeGSTIN" varchar(100),
	"ConsigneeState" varchar(100),
	"ConsigneeStateCode" varchar(100),
	"ConsigneePanNo" varchar(100),
	"IsSameAddress" boolean,
	"TotalAmtBeforeTax" numeric(15, 2),
	"PackingCharge" numeric(15, 2),
	"PCGSTRate" numeric(5, 2),
	"PCGSTAmt" numeric(15, 2),
	"PSGSTRate" numeric(5, 2),
	"PSGSTAmt" numeric(15, 2),
	"PIGSTRate" numeric(5, 2),
	"PIGSTAmt" numeric(15, 2),
	"CGST" numeric(15, 2),
	"SGST" numeric(15, 2),
	"IGST" numeric(15, 2),
	"TotalGSTTax" numeric(15, 2),
	"TotalAmtAfterTax" numeric(15, 2),
	"GSTReverseCharge" numeric(15, 2),
	"TotalInWords" text,
	"TaxInWords" text,
	"Remarks" text,
	"GrandTotalAmount" numeric(15, 2),
	"RoundOff" numeric(15, 2),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp,
	"Company" varchar(255),
	"InvoiceType" varchar(100),
	"QRCode" text,
	"IRNNo" varchar(255),
	"AckNo" varchar(255),
	"AckDate" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "StockCategory" (
	"StockCategoryID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "StockCategory_StockCategoryID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"StockCategoryName" varchar(255) NOT NULL,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "StockProduct" (
	"StockProductID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "StockProduct_StockProductID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"StockCategoryID" integer,
	"StockSubCategoryID" integer,
	"ModelID" integer,
	"PlungerDiaID" integer,
	"MOCID" integer,
	"ProductName" varchar(255) NOT NULL,
	"Description" text,
	"UOM" varchar(100),
	"HSN" varchar(100),
	"GSTRate" numeric(5, 2),
	"PricePerUnit" numeric(15, 2),
	"OpeningQTY" numeric(15, 4),
	"ClosingQTY" numeric(15, 4),
	"OpeningStockVal" numeric(15, 2),
	"ClosingStockVal" numeric(15, 2),
	"ReOrderLevel" numeric(15, 4),
	"FullGoodsName" varchar(255),
	"LastUpdated" varchar(255),
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "StockSubCategory" (
	"StockSubCategoryID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "StockSubCategory_StockSubCategoryID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"StockCategoryID" integer,
	"StockSubCategoryName" varchar(255) NOT NULL,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "SubCategory" (
	"SubCategoryID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "SubCategory_SubCategoryID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"CategoryID" integer,
	"SubCategoryName" varchar(255) NOT NULL,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "SuctionPressureMaster" (
	"SuctionPressureID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "SuctionPressureMaster_SuctionPressureID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"SuctionPressureName" varchar(255) NOT NULL,
	"CompanyName" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "Type" (
	"TypeID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Type_TypeID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"TypeName" varchar(255) NOT NULL,
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "Vendor" (
	"VendorID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Vendor_VendorID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"VendorName" varchar(255) NOT NULL,
	"ContactPerson" varchar(255),
	"Contact1" varchar(100),
	"Contact2" varchar(100),
	"Address" text,
	"City" varchar(100),
	"State" varchar(100),
	"StateCode" integer,
	"Email" varchar(255),
	"Website" varchar(255),
	"GSTStatus" varchar(100),
	"GSTIN" varchar(50),
	"PANNo" varchar(50),
	"VATNo" integer,
	"CSTNo" integer,
	"ECCNo" varchar(100),
	"IECCode" varchar(100),
	"Company" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "WorkOrderDetail" (
	"WorkOrderDetailID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "WorkOrderDetail_WorkOrderDetailID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"WorkOrderID" integer,
	"ProductName" varchar(255),
	"Description" text,
	"HSNACS" varchar(100),
	"UOM" varchar(100),
	"Qty" numeric(15, 4),
	"Rate" numeric(15, 2),
	"Amount" numeric(15, 2),
	"Discount" numeric(15, 2),
	"DiscountVal" numeric(15, 2),
	"TaxableValue" numeric(15, 2),
	"CGSTRate" numeric(5, 2),
	"CGSTAmt" numeric(15, 2),
	"SGSTRate" numeric(5, 2),
	"SGSTAmt" numeric(15, 2),
	"IGSTRate" numeric(5, 2),
	"IGSTAmt" numeric(15, 2),
	"TotalAmount" numeric(15, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "WorkOrder" (
	"WorkOrderID" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "WorkOrder_WorkOrderID_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"WO" varchar(255),
	"WODate" timestamp,
	"VendorID" integer,
	"DeliverySchedule" varchar(255),
	"QuotRef" varchar(255),
	"TransportorFOR" varchar(255),
	"PaymentDays" varchar(255),
	"AgainstForm" varchar(255),
	"ConsignorName" varchar(255),
	"ConsignorAddress" text,
	"ConsignorGSTIN" varchar(100),
	"ConsignorState" varchar(100),
	"ConsignorStateCode" varchar(100),
	"ConsignorPanNo" varchar(100),
	"TotalAmtBeforeTax" numeric(15, 2),
	"CGST" numeric(15, 2),
	"SGST" numeric(15, 2),
	"IGST" numeric(15, 2),
	"TotalGSTTax" numeric(15, 2),
	"TotalAmtAfterTax" numeric(15, 2),
	"GSTReverseCharge" numeric(15, 2),
	"TotalInWords" text,
	"TaxInWords" text,
	"Remarks" text,
	"GrandTotalAmount" numeric(15, 2),
	"RoundOff" numeric(15, 2),
	"CreatedBy" varchar(255),
	"ModifiedBy" varchar(255),
	"CreatedAt" timestamp DEFAULT now(),
	"UpdatedAt" timestamp,
	"Company" varchar(255),
	"WOType" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "role_id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "roles_role_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_CompanyID_Company_CompanyID_fk" FOREIGN KEY ("CompanyID") REFERENCES "public"."Company"("CompanyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Category" ADD CONSTRAINT "Category_CompanyID_Company_CompanyID_fk" FOREIGN KEY ("CompanyID") REFERENCES "public"."Company"("CompanyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FinancialSettings" ADD CONSTRAINT "FinancialSettings_CompanyID_Company_CompanyID_fk" FOREIGN KEY ("CompanyID") REFERENCES "public"."Company"("CompanyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "GoodsInventory" ADD CONSTRAINT "GoodsInventory_GoodsID_Goods_GoodsID_fk" FOREIGN KEY ("GoodsID") REFERENCES "public"."Goods"("GoodsID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_TypeID_Type_TypeID_fk" FOREIGN KEY ("TypeID") REFERENCES "public"."Type"("TypeID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_StockCategoryID_StockCategory_StockCategoryID_fk" FOREIGN KEY ("StockCategoryID") REFERENCES "public"."StockCategory"("StockCategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_StockSubCategoryID_StockSubCategory_StockSubCategoryID_fk" FOREIGN KEY ("StockSubCategoryID") REFERENCES "public"."StockSubCategory"("StockSubCategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "InvoiceDetail" ADD CONSTRAINT "InvoiceDetail_InvoiceID_Invoice_InvoiceID_fk" FOREIGN KEY ("InvoiceID") REFERENCES "public"."Invoice"("InvoiceID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_PartyID_Party_PartyID_fk" FOREIGN KEY ("PartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_ConsigneePartyID_Party_PartyID_fk" FOREIGN KEY ("ConsigneePartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "POProduct" ADD CONSTRAINT "POProduct_CategoryID_Category_CategoryID_fk" FOREIGN KEY ("CategoryID") REFERENCES "public"."Category"("CategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "POProduct" ADD CONSTRAINT "POProduct_SubCategoryID_SubCategory_SubCategoryID_fk" FOREIGN KEY ("SubCategoryID") REFERENCES "public"."SubCategory"("SubCategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_CategoryID_Category_CategoryID_fk" FOREIGN KEY ("CategoryID") REFERENCES "public"."Category"("CategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Product" ADD CONSTRAINT "Product_SubCategoryID_SubCategory_SubCategoryID_fk" FOREIGN KEY ("SubCategoryID") REFERENCES "public"."SubCategory"("SubCategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProformaInvoiceDetail" ADD CONSTRAINT "ProformaInvoiceDetail_ProformaInvoiceID_ProformaInvoice_ProformaInvoiceID_fk" FOREIGN KEY ("ProformaInvoiceID") REFERENCES "public"."ProformaInvoice"("ProformaInvoiceID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_PartyID_Party_PartyID_fk" FOREIGN KEY ("PartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProformaInvoice" ADD CONSTRAINT "ProformaInvoice_ConsigneePartyID_Party_PartyID_fk" FOREIGN KEY ("ConsigneePartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProformaServiceInvoiceDetail" ADD CONSTRAINT "ProformaServiceInvoiceDetail_ProformaServiceInvoiceID_ProformaServiceInvoice_ProformaServiceInvoiceID_fk" FOREIGN KEY ("ProformaServiceInvoiceID") REFERENCES "public"."ProformaServiceInvoice"("ProformaServiceInvoiceID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProformaServiceInvoice" ADD CONSTRAINT "ProformaServiceInvoice_PartyID_Party_PartyID_fk" FOREIGN KEY ("PartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProformaServiceInvoice" ADD CONSTRAINT "ProformaServiceInvoice_ConsigneePartyID_Party_PartyID_fk" FOREIGN KEY ("ConsigneePartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalCustomFields" ADD CONSTRAINT "ProposalCustomFields_ProposalID_ProposalHistory_ProposalID_fk" FOREIGN KEY ("ProposalID") REFERENCES "public"."ProposalHistory"("ProposalID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalExtraProducts" ADD CONSTRAINT "ProposalExtraProducts_ProposalID_ProposalHistory_ProposalID_fk" FOREIGN KEY ("ProposalID") REFERENCES "public"."ProposalHistory"("ProposalID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalHistory" ADD CONSTRAINT "ProposalHistory_CompanyID_Company_CompanyID_fk" FOREIGN KEY ("CompanyID") REFERENCES "public"."Company"("CompanyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalHistory" ADD CONSTRAINT "ProposalHistory_PartyID_Party_PartyID_fk" FOREIGN KEY ("PartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalHistory" ADD CONSTRAINT "ProposalHistory_ProductID_Product_ProductID_fk" FOREIGN KEY ("ProductID") REFERENCES "public"."Product"("ProductID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalHistory" ADD CONSTRAINT "ProposalHistory_PumpTypeID_PumpTypeMaster_PumpTypeID_fk" FOREIGN KEY ("PumpTypeID") REFERENCES "public"."PumpTypeMaster"("PumpTypeID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalHistory" ADD CONSTRAINT "ProposalHistory_PumpModelID_PumpModelMaster_PumpModelID_fk" FOREIGN KEY ("PumpModelID") REFERENCES "public"."PumpModelMaster"("PumpModelID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalScopeHistory" ADD CONSTRAINT "ProposalScopeHistory_ProposalID_ProposalHistory_ProposalID_fk" FOREIGN KEY ("ProposalID") REFERENCES "public"."ProposalHistory"("ProposalID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalSignatory" ADD CONSTRAINT "ProposalSignatory_CompanyID_Company_CompanyID_fk" FOREIGN KEY ("CompanyID") REFERENCES "public"."Company"("CompanyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ProposalTermsHistory" ADD CONSTRAINT "ProposalTermsHistory_ProposalID_ProposalHistory_ProposalID_fk" FOREIGN KEY ("ProposalID") REFERENCES "public"."ProposalHistory"("ProposalID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PurchaseOrderDetail" ADD CONSTRAINT "PurchaseOrderDetail_PurchaseOrderID_PurchaseOrder_PurchaseOrderID_fk" FOREIGN KEY ("PurchaseOrderID") REFERENCES "public"."PurchaseOrder"("PurchaseOrderID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_VendorID_Vendor_VendorID_fk" FOREIGN KEY ("VendorID") REFERENCES "public"."Vendor"("VendorID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "QuotationDetail" ADD CONSTRAINT "QuotationDetail_QuotationID_Quotation_QuotationID_fk" FOREIGN KEY ("QuotationID") REFERENCES "public"."Quotation"("QuotationID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "QuotationDetail" ADD CONSTRAINT "QuotationDetail_CategoryID_Category_CategoryID_fk" FOREIGN KEY ("CategoryID") REFERENCES "public"."Category"("CategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_PartyID_Party_PartyID_fk" FOREIGN KEY ("PartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ServiceInvoiceDetail" ADD CONSTRAINT "ServiceInvoiceDetail_ServiceInvoiceID_ServiceInvoice_ServiceInvoiceID_fk" FOREIGN KEY ("ServiceInvoiceID") REFERENCES "public"."ServiceInvoice"("ServiceInvoiceID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ServiceInvoice" ADD CONSTRAINT "ServiceInvoice_PartyID_Party_PartyID_fk" FOREIGN KEY ("PartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ServiceInvoice" ADD CONSTRAINT "ServiceInvoice_ConsigneePartyID_Party_PartyID_fk" FOREIGN KEY ("ConsigneePartyID") REFERENCES "public"."Party"("PartyID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StockProduct" ADD CONSTRAINT "StockProduct_StockCategoryID_StockCategory_StockCategoryID_fk" FOREIGN KEY ("StockCategoryID") REFERENCES "public"."StockCategory"("StockCategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StockProduct" ADD CONSTRAINT "StockProduct_StockSubCategoryID_StockSubCategory_StockSubCategoryID_fk" FOREIGN KEY ("StockSubCategoryID") REFERENCES "public"."StockSubCategory"("StockSubCategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StockProduct" ADD CONSTRAINT "StockProduct_ModelID_Model_ModelID_fk" FOREIGN KEY ("ModelID") REFERENCES "public"."Model"("ModelID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StockProduct" ADD CONSTRAINT "StockProduct_PlungerDiaID_PlungerDia_PlungerDiaID_fk" FOREIGN KEY ("PlungerDiaID") REFERENCES "public"."PlungerDia"("PlungerDiaID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StockProduct" ADD CONSTRAINT "StockProduct_MOCID_MOC_MOCID_fk" FOREIGN KEY ("MOCID") REFERENCES "public"."MOC"("MOCID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "StockSubCategory" ADD CONSTRAINT "StockSubCategory_StockCategoryID_StockCategory_StockCategoryID_fk" FOREIGN KEY ("StockCategoryID") REFERENCES "public"."StockCategory"("StockCategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_CategoryID_Category_CategoryID_fk" FOREIGN KEY ("CategoryID") REFERENCES "public"."Category"("CategoryID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WorkOrderDetail" ADD CONSTRAINT "WorkOrderDetail_WorkOrderID_WorkOrder_WorkOrderID_fk" FOREIGN KEY ("WorkOrderID") REFERENCES "public"."WorkOrder"("WorkOrderID") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_VendorID_Vendor_VendorID_fk" FOREIGN KEY ("VendorID") REFERENCES "public"."Vendor"("VendorID") ON DELETE no action ON UPDATE no action;