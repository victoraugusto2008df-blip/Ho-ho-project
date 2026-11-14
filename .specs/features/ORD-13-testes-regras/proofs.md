# ORD-13-testes-regras proofs

**HEAD**: c92ad7c
**Tree**: clean
**Shell**: C:/Program Files/Git\bin\bash.exe
**Result**: 15 pass, 0 fail

| Check | Proof | Result |
| --- | --- | --- |
| C1 | `run regras / duplicateKeyIsRejectedWith409AndPublishesNothing -- Time elapsed` | pass |
| C2 | `run regras / uniqueKeyIsPersistedAndPublishesOneEvent -- Time elapsed` | pass |
| C3 | `run regras / noteOlderThan72hIsRejectedAndNotSaved -- Time elapsed` | pass |
| C4 | `run regras / noteWithin72hIsAccepted -- Time elapsed` | pass |
| C5 | `run regras / reachingTheGoalEmitsVoucherWithTheDailySum -- Time elapsed` | pass |
| C6 | `run regras / belowTheGoalEmitsNoVoucher -- Time elapsed` | pass |
| C7 | `run regras / sumIsRequestedForTheClientAndTheClockDayOnly -- Time elapsed` | pass |
| C7 | `cd backend && ./mvnw -B -q test -Dtest=EstacionamentoIntegrationTest#onlyApprovedReceiptsFromTodayAreSummed` | pass |
| C8 | `run regras / secondAttemptSameDayEmitsNoVoucher -- Time elapsed` | pass |
| C9 | `run regras / firstAttemptEmitsExactlyOneVoucherAndToleratesARace -- Time elapsed` | pass |
| C10 | `run regras / belowThreeActiveStoresHidesTheCategoryAverage -- Time elapsed` | pass |
| C11 | `run regras / fromThreeActiveStoresShowsTheCategoryAverage -- Time elapsed` | pass |
| C12 | `cd backend && ./mvnw -B -q test -DargLine=-Dnet.bytebuddy.experimental=true` | pass |
| C13 | `! grep -rn "@Disabled" backend/src/test` | pass |
| Build | `cd backend && ./mvnw -B -q -DskipTests compile test-compile` | pass |

## Output

`Run regras` - exit 0

```
[INFO] com.hoho.shoppinghub.fiscal.service.FiscalServiceRegrasTest.noteOlderThan72hIsRejectedAndNotSaved -- Time elapsed: 0.173 s
[INFO] com.hoho.shoppinghub.fiscal.service.FiscalServiceRegrasTest.duplicateKeyIsRejectedWith409AndPublishesNothing -- Time elapsed: 0.009 s
[INFO] com.hoho.shoppinghub.fiscal.service.FiscalServiceRegrasTest.noteWithin72hIsAccepted -- Time elapsed: 0.006 s
[INFO] com.hoho.shoppinghub.fiscal.service.FiscalServiceRegrasTest.uniqueKeyIsPersistedAndPublishesOneEvent -- Time elapsed: 0.006 s
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  6.638 s
[INFO] Finished at: 2026-11-14T12:57:02-03:00
[INFO] ------------------------------------------------------------------------
```

`cd backend && ./mvnw -B -q test -Dtest=EstacionamentoIntegrationTest#onlyApprovedReceiptsFromTodayAreSummed` - exit 0

```
	Maximum pool size: undefined/unknown
2026-11-14T12:57:22.352-03:00  INFO 101748 --- [shopping-hub] [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000489: No JTA platform available (set 'hibernate.transaction.jta.platform' to enable JTA platform integration)
2026-11-14T12:57:22.427-03:00  INFO 101748 --- [shopping-hub] [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2026-11-14T12:57:22.901-03:00  INFO 101748 --- [shopping-hub] [           main] r$InitializeUserDetailsManagerConfigurer : Global AuthenticationManager configured with UserDetailsService bean with name usuarioDetailsService
2026-11-14T12:57:22.984-03:00  INFO 101748 --- [shopping-hub] [           main] o.s.d.j.r.query.QueryEnhancerFactory     : Hibernate is in classpath; If applicable, HQL parser will be used.
2026-11-14T12:57:25.071-03:00  INFO 101748 --- [shopping-hub] [           main] o.s.b.t.m.w.SpringBootMockServletContext : Initializing Spring TestDispatcherServlet ''
2026-11-14T12:57:25.072-03:00  INFO 101748 --- [shopping-hub] [           main] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-14T12:57:25.073-03:00  INFO 101748 --- [shopping-hub] [           main] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 1 ms
2026-11-14T12:57:25.120-03:00  INFO 101748 --- [shopping-hub] [           main] c.h.s.EstacionamentoIntegrationTest      : Started EstacionamentoIntegrationTest in 12.664 seconds (process running for 14.092)
Mockito is currently self-attaching to enable the inline-mock-maker. This will no longer work in future releases of the JDK. Please add Mockito as an agent to your build what is described in Mockito's documentation: https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html#0.3
Java HotSpot(TM) 64-Bit Server VM warning: Sharing is only supported for boot loader classes because bootstrap classpath has been appended
WARNING: A Java agent has been loaded dynamically (C:\Users\brito\.m2\repository\net\bytebuddy\byte-buddy-agent\1.15.11\byte-buddy-agent-1.15.11.jar)
WARNING: If a serviceability tool is in use, please run with -XX:+EnableDynamicAgentLoading to hide this warning
WARNING: If a serviceability tool is not in use, please run with -Djdk.instrument.traceUsage for more information
WARNING: Dynamic loading of agents will be disallowed by default in a future release
```

`cd backend && ./mvnw -B -q test -DargLine=-Dnet.bytebuddy.experimental=true` - exit 0

```
2026-11-14T12:57:58.577-03:00  INFO 102200 --- [shopping-hub] [           main] o.s.t.web.servlet.TestDispatcherServlet  : Initializing Servlet ''
2026-11-14T12:57:58.577-03:00  INFO 102200 --- [shopping-hub] [           main] o.s.t.web.servlet.TestDispatcherServlet  : Completed initialization in 0 ms
2026-11-14T12:57:58.586-03:00  INFO 102200 --- [shopping-hub] [           main] c.h.s.FiscalIngestionIntegrationTest     : Started FiscalIngestionIntegrationTest in 3.441 seconds (process running for 23.344)
2026-11-14T12:57:58.646-03:00  WARN 102200 --- [shopping-hub] [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 0, SQLState: 23505
2026-11-14T12:57:58.646-03:00 ERROR 102200 --- [shopping-hub] [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : ERROR: duplicate key value violates unique constraint "uk_notas_fiscais_chave_acesso"
  Detalhe: Key (chave_acesso)=(35261155555555000105650010000001030000000103) already exists.
2026-11-14T12:57:58.746-03:00  WARN 102200 --- [shopping-hub] [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : SQL Error: 0, SQLState: 23505
2026-11-14T12:57:58.746-03:00 ERROR 102200 --- [shopping-hub] [           main] o.h.engine.jdbc.spi.SqlExceptionHelper   : ERROR: duplicate key value violates unique constraint "uk_notas_fiscais_chave_acesso"
  Detalhe: Key (chave_acesso)=(35261144444444000104650010000001040000000104) already exists.
2026-11-14T12:57:58.790-03:00  INFO 102200 --- [shopping-hub] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.hoho.shoppinghub.SecurityIntegrationTest]: SecurityIntegrationTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2026-11-14T12:57:58.798-03:00  INFO 102200 --- [shopping-hub] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.hoho.shoppinghub.ShoppingHubApplication for test class com.hoho.shoppinghub.SecurityIntegrationTest
2026-11-14T12:57:58.847-03:00  INFO 102200 --- [shopping-hub] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.hoho.shoppinghub.ShoppingHubApplicationTests]: ShoppingHubApplicationTests does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2026-11-14T12:57:58.858-03:00  INFO 102200 --- [shopping-hub] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.hoho.shoppinghub.ShoppingHubApplication for test class com.hoho.shoppinghub.ShoppingHubApplicationTests
2026-11-14T12:57:58.865-03:00  INFO 102200 --- [shopping-hub] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.hoho.shoppinghub.TenantIsolationTest]: TenantIsolationTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2026-11-14T12:57:58.873-03:00  INFO 102200 --- [shopping-hub] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.hoho.shoppinghub.ShoppingHubApplication for test class com.hoho.shoppinghub.TenantIsolationTest
```

`! grep -rn "@Disabled" backend/src/test` - exit 0

```
(no output)
```
