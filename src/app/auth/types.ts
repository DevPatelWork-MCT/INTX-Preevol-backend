export interface AuthUser {
    id: string
    isAdmin: boolean
    roleId: number | null
    accountStatus: string
    company: string | null
    sessionToken?: string
}
