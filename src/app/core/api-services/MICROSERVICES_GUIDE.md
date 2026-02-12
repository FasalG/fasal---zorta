# Microservices API Guide - BizArabia

## Architecture Overview

The application uses a **tiered microservices architecture** with centralized request handling:

```
RestService (Base Service)
    ↓
├── AccountsApiService
├── AdminApiService
├── InventoryApiService
└── [Future Services]
```

---

## 1. REST Service (Base/Container)

### Key Features
✅ **Unified HTTP Request Handling** - Centralized method dispatch (GET, POST, PUT, DELETE, PATCH)
✅ **Automatic Retry Logic** - Configurable retry attempts with exponential backoff
✅ **Request/Response Caching** - In-memory cache with key-based invalidation
✅ **Request Timeout** - Configurable timeout per request
✅ **Comprehensive Logging** - Built-in request/response/error logging for debugging
✅ **Error Handling** - Standardized error responses with status codes
✅ **Header & Param Building** - Automatic filtering of null/empty values

### Configuration Options

```typescript
export interface HttpRequestConfig {
  method: HttpMethodEnum;          // GET, POST, PUT, DELETE, PATCH
  endpoint: string;                // /Accounts/GetAsync (without base URL)
  params?: Record<string, any>;    // Query parameters
  body?: any;                      // Request body
  headers?: Record<string, string>; // Custom headers
  enableLogging?: boolean;         // Enable request/response logging
  retryAttempts?: number;          // Default: 1
  requestTimeout?: number;         // Default: 30000ms
  cacheKey?: string;              // Cache key for response (e.g., "accounts_ledger_1")
}
```

---

## 2. URL Handling Strategies

### Strategy 1: Service-Based URLs (Recommended)
Each service manages its own base URL with a specific microservice endpoint.

**Implementation:**
```typescript
// AdminApiService
private apibaseUrl = apiBaseUrl + '/Admin';

request({
  method: 'GET',
  endpoint: '/Users/GetAsync',  // Becomes: http://api.example.com/Admin/Users/GetAsync
  params: { CompanyID: 1 }
})
```

**Pros:** Clean separation, easy to identify which service is called
**Cons:** Requires '/Admin', '/Accounts' prefixes in each service

### Strategy 2: Environment-Based Microservice URLs
Store multiple service URLs in config file.

**Implementation:**
```json
// assets/config.json
{
  "apiBaseUrl": "http://api.example.com",
  "microservices": {
    "accounts": "http://accounts-service.example.com",
    "admin": "http://admin-service.example.com",
    "inventory": "http://inventory-service.example.com"
  }
}
```

```typescript
// In service
private serviceUrl = this.msConfig.microservices.admin;

request({
  method: 'GET',
  endpoint: '/Users/GetAsync',  // Full URL: http://admin-service.example.com/Users/GetAsync
  params: { CompanyID: 1 }
})
```

**Pros:** True microservices; independent service scaling
**Cons:** More config management; network calls to different domains

### Strategy 3: API Gateway + Service Routing
Use API Gateway pattern to route requests to appropriate service.

**Implementation:**
```typescript
request({
  method: 'GET',
  endpoint: '/admin/Users/GetAsync',  // Gateway routes to Admin service
  params: { CompanyID: 1 }
})
```

**Pros:** Single entry point; centralized auth/logging
**Cons:** Additional network hop; gateway becomes bottleneck

---

## 3. Service Implementation Examples

### AccountsApiService

```typescript
@Injectable({ providedIn: 'root' })
export class AccountsApiService {
  private apibaseUrl = apiBaseUrl + '/Accounts';

  constructor(private restService: RestService) {}

  getLedgers(companyId: number): Observable<any> {
    return this.restService.request({
      method: HttpMethodEnum.GET,
      endpoint: '/AccountLedger/GetAsync',
      params: { CompanyID: companyId },
      enableLogging: true,
      cacheKey: `ledgers_${companyId}`,
      retryAttempts: 2
    });
  }

  createAccount(body: any): Observable<any> {
    return this.restService.request({
      method: HttpMethodEnum.POST,
      endpoint: '/Accounts/Create',
      body,
      enableLogging: true
    });
  }

  updateAccount(id: number, body: any): Observable<any> {
    return this.restService.request({
      method: HttpMethodEnum.PUT,
      endpoint: `/Accounts/Update/${id}`,
      body,
      enableLogging: true
    });
  }

  deleteAccount(id: number): Observable<any> {
    return this.restService.request({
      method: HttpMethodEnum.DELETE,
      endpoint: `/Accounts/Delete/${id}`,
      enableLogging: true
    });
  }
}
```

### AdminApiService

```typescript
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private apibaseUrl = apiBaseUrl + '/Admin';

  constructor(private restService: RestService) {}

  getUsers(companyId: number): Observable<any> {
    return this.restService.request({
      method: HttpMethodEnum.GET,
      endpoint: '/StyUserAccounts/GetAsync',
      params: {
        CompanyID: companyId,
        BranchID: '%',
        DepartmentID: '%',
        JobPositionID: '%'
      },
      enableLogging: true,
      cacheKey: `users_${companyId}`,
      retryAttempts: 3
    });
  }

  createUser(body: any): Observable<any> {
    return this.restService.request({
      method: HttpMethodEnum.POST,
      endpoint: '/Users/Create',
      body,
      enableLogging: true
    });
  }
}
```

---

## 4. Using Services in Components

### Basic Usage
```typescript
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const companyId = 1;
    this.adminApi.getUsers(companyId).subscribe({
      next: (response) => {
        this.users = response;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error || 'Failed to load users';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  createUser(userData: any): void {
    this.adminApi.createUser(userData).subscribe({
      next: (response) => {
        console.log('User created:', response);
        this.loadUsers(); // Refresh list
      },
      error: (err) => console.error('Create failed:', err)
    });
  }
}
```

### With RxJS Operators
```typescript
import { switchMap, catchError } from 'rxjs/operators';

getCompanyUsers(companyId: number): Observable<any> {
  return this.adminApi.getUsers(companyId).pipe(
    switchMap(users => {
      // Do something with users
      return of(users);
    }),
    catchError(error => {
      console.error('Error:', error);
      return of([]); // Return empty array on error
    })
  );
}
```

---

## 5. Caching Strategy

### Cache Keys Best Practices
```typescript
// Format: service_entity_id
cacheKey: 'accounts_ledger_1'      // Ledger for company 1
cacheKey: 'admin_users_2'          // Users for company 2
cacheKey: 'inventory_products'     // All products
```

### Cache Management
```typescript
// Clear specific cache
this.restService.clearCache('accounts_ledger_1');

// Clear all cache
this.restService.clearAllCache();

// Get cache stats
const stats = this.restService.getCacheStats();
console.log(`Cached items: ${stats.size}`, stats.keys);
```

### Cache Invalidation Pattern
```typescript
createAccount(body: any): Observable<any> {
  return this.restService.request({
    method: HttpMethodEnum.POST,
    endpoint: '/Accounts/Create',
    body
  }).pipe(
    tap(() => {
      // Invalidate ledger cache on create
      this.restService.clearCache('accounts_ledger_' + body.companyId);
    })
  );
}
```

---

## 6. Error Handling

### Standard Error Response
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  timestamp?: Date;
}
```

### Error Types
```typescript
// Network error
{ success: false, error: 'Network error', statusCode: 0 }

// 4xx Client error
{ success: false, error: 'Bad request', statusCode: 400 }

// 5xx Server error
{ success: false, error: 'Internal server error', statusCode: 500 }

// Timeout error
{ success: false, error: 'Request timeout', statusCode: 504 }
```

---

## 7. Logging & Debugging

### View Request Logs
```typescript
constructor(private restService: RestService) {
  // In console
  console.log(this.restService.getRequestLogs());
}
```

### Enable Logging Per Request
```typescript
request({
  method: HttpMethodEnum.GET,
  endpoint: '/Users/GetAsync',
  enableLogging: true  // Logs request, response, and errors
})
```

---

## 8. Migration Checklist

- [ ] Update `RestService` with new `request()` method
- [ ] Refactor `AccountsApiService` to use `RestService`
- [ ] Refactor `AdminApiService` to use `RestService`
- [ ] Refactor `InventoryApiService` to use `RestService`
- [ ] Update all components using old API service methods
- [ ] Configure caching keys for frequently accessed data
- [ ] Set appropriate retry counts and timeouts
- [ ] Test all endpoints with logging enabled
- [ ] Clear logs and cache in navigation/logout handlers

---

## 9. Best Practices

1. **Always use proper HTTP methods** - GET for reads, POST for creates, PUT/PATCH for updates, DELETE for deletes
2. **Implement proper error handling** - Don't suppress errors; log and handle them gracefully
3. **Use caching wisely** - Cache GET requests, invalidate on POST/PUT/DELETE
4. **Set appropriate timeouts** - Longer for file uploads, shorter for quick operations
5. **Use retry for idempotent operations** - Safe for GET, DELETE (if idempotent); avoid for POST
6. **Group related endpoints** - Keep related operations in dedicated service classes
7. **Document cache keys** - Clear naming helps prevent stale data issues
8. **Monitor logs** - Use `getRequestLogs()` to debug integration issues

---

## 10. Configuration File Template

```json
// assets/config.json
{
  "apiBaseUrl": "http://localhost:5000/api",
  "microservices": {
    "accounts": "http://localhost:5001/api",
    "admin": "http://localhost:5002/api",
    "inventory": "http://localhost:5003/api"
  },
  "httpTimeout": 30000,
  "retryAttempts": 1,
  "cacheExpiry": 300000
}
```
