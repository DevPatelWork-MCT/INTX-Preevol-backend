export const openApiSpec = {
    openapi: '3.1.0',
    info: {
        title: 'Preevol Backend API',
        version: '1.0.0',
        description: 'Authentication & Admin API',
    },
    servers: [{ url: 'http://localhost:8080' }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/auth/sign-up': {
            post: {
                tags: ['Authentication'],
                summary: 'Create a new account',
                description: 'Creates a user account with pending status. Admin approval required before login.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['firstName', 'email', 'password'],
                                properties: {
                                    firstName: { type: 'string', minLength: 2, example: 'John' },
                                    lastName: { type: 'string', nullable: true, example: 'Doe' },
                                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                                    password: { type: 'string', minLength: 6, maxLength: 100, example: 'password123' },
                                    company: { type: 'string', nullable: true, example: 'Acme Corp' },
                                    isAdmin: { type: 'boolean', default: false, description: 'Request admin privileges' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Account created, pending approval',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string', example: 'Account created. Awaiting admin approval.' },
                                        data: {
                                            type: 'object',
                                            properties: { id: { type: 'string', format: 'uuid' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '400': { description: 'Validation error or duplicate email' },
                },
            },
        },
        '/auth/sign-in': {
            post: {
                tags: ['Authentication'],
                summary: 'Sign in',
                description: 'Authenticates a user and returns a session token. Blocked for pending/rejected accounts.',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                                    password: { type: 'string', minLength: 6, maxLength: 100, example: 'password123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Signin successful',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        data: {
                                            type: 'object',
                                            properties: {
                                                token: { type: 'string' },
                                                expiresAt: { type: 'string', format: 'date-time' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '403': { description: 'Account is pending or rejected' },
                    '404': { description: 'User not found' },
                    '400': { description: 'Incorrect password' },
                },
            },
        },
        '/auth/sign-out': {
            post: {
                tags: ['Authentication'],
                summary: 'Sign out',
                description: 'Invalidates the current session token.',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'Signed out successfully' },
                    '401': { description: 'Authentication required' },
                },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Authentication'],
                summary: 'Get current user',
                description: 'Returns the authenticated user profile with role info.',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'User profile',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'string', format: 'uuid' },
                                        firstName: { type: 'string' },
                                        lastName: { type: 'string', nullable: true },
                                        email: { type: 'string' },
                                        company: { type: 'string', nullable: true },
                                        accountStatus: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                                        isAdmin: { type: 'boolean' },
                                        adminRequested: { type: 'boolean' },
                                        role: {
                                            type: 'object',
                                            nullable: true,
                                            properties: {
                                                roleId: { type: 'integer' },
                                                roleName: { type: 'string' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    '401': { description: 'Authentication required' },
                },
            },
        },
        '/admin/users': {
            get: {
                tags: ['Admin'],
                summary: 'List all users',
                description: 'Lists all users, optionally filtered by account status.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'status',
                        in: 'query',
                        required: false,
                        schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                        description: 'Filter by account status',
                    },
                ],
                responses: {
                    '200': {
                        description: 'List of users',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string', format: 'uuid' },
                                                    firstName: { type: 'string' },
                                                    lastName: { type: 'string', nullable: true },
                                                    email: { type: 'string' },
                                                    company: { type: 'string', nullable: true },
                                                    accountStatus: { type: 'string' },
                                                    isAdmin: { type: 'boolean' },
                                                    adminRequested: { type: 'boolean' },
                                                    role: {
                                                        type: 'object',
                                                        nullable: true,
                                                        properties: {
                                                            roleId: { type: 'integer' },
                                                            roleName: { type: 'string' },
                                                        },
                                                    },
                                                    createdAt: { type: 'string', format: 'date-time' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/admin/users/{id}': {
            get: {
                tags: ['Admin'],
                summary: 'Get user by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' },
                    },
                ],
                responses: {
                    '200': { description: 'User details' },
                    '404': { description: 'User not found' },
                },
            },
        },
        '/admin/users/{id}/approve': {
            patch: {
                tags: ['Admin'],
                summary: 'Approve user',
                description: 'Approves a pending user, assigns a role, and optionally grants admin.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    roleId: { type: 'integer', description: 'Role ID to assign' },
                                    grantAdmin: { type: 'boolean', default: false, description: 'Grant admin privileges' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'User approved successfully' },
                    '400': { description: 'User already approved or invalid roleId' },
                    '404': { description: 'User not found' },
                },
            },
        },
        '/admin/users/{id}/reject': {
            patch: {
                tags: ['Admin'],
                summary: 'Reject user',
                description: 'Rejects a pending user and invalidates their sessions.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' },
                    },
                ],
                responses: {
                    '200': { description: 'User rejected successfully' },
                    '400': { description: 'User already rejected' },
                    '404': { description: 'User not found' },
                },
            },
        },
        '/admin/users/{id}/role': {
            patch: {
                tags: ['Admin'],
                summary: 'Update user role',
                description: 'Updates the role assigned to an approved user.',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['roleId'],
                                properties: {
                                    roleId: { type: 'integer', nullable: true, description: 'Role ID or null to unassign' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'User role updated' },
                    '400': { description: 'User not approved or invalid roleId' },
                    '404': { description: 'User not found' },
                },
            },
        },
        '/admin/roles': {
            get: {
                tags: ['Admin - Roles'],
                summary: 'List all roles',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'List of roles',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        data: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    roleId: { type: 'integer' },
                                                    roleName: { type: 'string' },
                                                    company: { type: 'string', nullable: true },
                                                    createdAt: { type: 'string', format: 'date-time' },
                                                    updatedAt: { type: 'string', format: 'date-time' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ['Admin - Roles'],
                summary: 'Create a role',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['roleName'],
                                properties: {
                                    roleName: { type: 'string', maxLength: 100, example: 'Editor' },
                                    company: { type: 'string', maxLength: 100, nullable: true, example: 'Acme' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Role created' },
                    '400': { description: 'Validation error' },
                },
            },
        },
        '/financial-years': {
            get: {
                tags: ['Financial Years'],
                summary: 'List financial years',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'companyId',
                        in: 'query',
                        required: false,
                        schema: { type: 'integer' },
                        description: 'Filter by company id',
                    },
                ],
                responses: {
                    '200': { description: 'List of financial years' },
                },
            },
            post: {
                tags: ['Financial Years'],
                summary: 'Create a financial year',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['CompanyID', 'FinancialYear', 'StartDate', 'EndDate'],
                                properties: {
                                    CompanyID: { type: 'integer', example: 1 },
                                    FinancialYear: { type: 'string', example: '2026-2027' },
                                    StartDate: { type: 'string', format: 'date-time', example: '2026-04-01T00:00:00Z' },
                                    EndDate: { type: 'string', format: 'date-time', example: '2027-03-31T23:59:59Z' },
                                    SalesInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    ServiceInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    ProformaSalesInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    ProformaServiceInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    QuotationCount: { type: 'string', nullable: true, example: '1' },
                                    ProposalCount: { type: 'string', nullable: true, example: '1' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Financial year created' },
                    '400': { description: 'Validation error or invalid CompanyID' },
                },
            },
        },
        '/financial-years/{companyId}/{id}': {
            get: {
                tags: ['Financial Years'],
                summary: 'Get a financial year',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'companyId', in: 'path', required: true, schema: { type: 'integer' } },
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
                ],
                responses: {
                    '200': { description: 'Financial year details' },
                    '404': { description: 'Financial year not found' },
                },
            },
            patch: {
                tags: ['Financial Years'],
                summary: 'Update a financial year',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'companyId', in: 'path', required: true, schema: { type: 'integer' } },
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
                ],
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    FinancialYear: { type: 'string', example: '2026-2027' },
                                    StartDate: { type: 'string', format: 'date-time', example: '2026-04-01T00:00:00Z' },
                                    EndDate: { type: 'string', format: 'date-time', example: '2027-03-31T23:59:59Z' },
                                    SalesInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    ServiceInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    ProformaSalesInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    ProformaServiceInvoiceCount: { type: 'string', nullable: true, example: '1' },
                                    QuotationCount: { type: 'string', nullable: true, example: '1' },
                                    ProposalCount: { type: 'string', nullable: true, example: '1' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Financial year updated' },
                    '400': { description: 'Validation error' },
                    '404': { description: 'Financial year not found' },
                },
            },
            delete: {
                tags: ['Financial Years'],
                summary: 'Delete a financial year',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'companyId', in: 'path', required: true, schema: { type: 'integer' } },
                    { name: 'id', in: 'path', required: true, schema: { type: 'integer' } },
                ],
                responses: {
                    '200': { description: 'Financial year deleted' },
                    '404': { description: 'Financial year not found' },
                },
            },
        },
    },
}
