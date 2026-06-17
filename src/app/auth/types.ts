export interface AuthUser {
    id: string
    isAdmin: boolean
    roleId: number | null
    accountStatus: string
    company: string | null
    companyId: number | null
    sessionToken?: string
}
