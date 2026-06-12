import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const optionalDecimal = z.coerce.string().nullable().optional()
const optionalInteger = z.number().int().positive().nullable().optional()
const optionalTimestamp = z.coerce.date().nullable().optional()

export const createGoodsPayloadModel = z.object({
    TypeID: optionalInteger,
    TypeName: optionalString(255),
    StockCategoryID: optionalInteger,
    StockSubCategoryID: optionalInteger,
    ModelName: optionalString(255),
    PlungerDiaName: optionalString(255),
    GoodsName: optionalString(255),
    Description: z.string().nullable().optional(),
    UOM: optionalString(100),
    HSN: optionalString(100),
    GSTRate: optionalDecimal,
    AvgPricePerUnit: optionalDecimal,
    OpeningQTY: optionalDecimal,
    ClosingQTY: optionalDecimal,
    ClosingStockVal: optionalDecimal,
    ReOrderLevel: optionalDecimal,
    FullGoodsName: optionalString(255),
    LastUpdate: optionalString(255),
    Company: optionalString(255),
})

export const updateGoodsPayloadModel = createGoodsPayloadModel.partial()

export const createInventoryPayloadModel = z.object({
    GoodsID: optionalInteger,
    PartyName: optionalString(255),
    PartyOtherdetail: optionalString(255),
    InvDate: optionalTimestamp,
    UMO: optionalString(100),
    Qty: optionalDecimal,
    PricePerUnit: optionalDecimal,
    TotalPrice: optionalDecimal,
    Remarks: z.string().nullable().optional(),
    InventoryType: optionalString(100),
    Company: optionalString(255),
})

export const updateInventoryPayloadModel = createInventoryPayloadModel.partial()
