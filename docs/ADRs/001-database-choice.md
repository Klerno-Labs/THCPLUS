# ADR 001: Database Choice - Vercel Postgres

**Status**: Accepted

**Date**: 2026-01-24

**Deciders**: Development Team

## Context

THC Plus requires a reliable, scalable database for storing:
- Contact form submissions
- Age verification logs (legal compliance)
- Admin user accounts

We needed a database solution that:
- Supports PostgreSQL (robust, widely-used SQL database)
- Integrates seamlessly with Next.js and Vercel deployment
- Offers a free tier for initial deployment
- Provides connection pooling for serverless environments
- Has predictable pricing for scaling

## Decision

We chose **Vercel Postgres** with **Prisma ORM**.

## Alternatives Considered

### 1. **Supabase**
- **Pros**: Generous free tier (500MB, unlimited API requests), built-in auth, real-time subscriptions
- **Cons**: Additional service to manage, auth conflicts with NextAuth.js, overkill for our needs
- **Why not**: We don't need real-time features or Supabase auth (using NextAuth.js)

### 2. **PlanetScale**
- **Pros**: MySQL-based, generous free tier, excellent developer experience
- **Cons**: MySQL instead of PostgreSQL, different migration workflow
- **Why not**: Team has more PostgreSQL experience, Prisma works better with PostgreSQL

### 3. **Railway**
- **Pros**: Simple pricing, good developer experience
- **Cons**: No free tier, $5/month minimum
- **Why not**: Higher cost for initial deployment

### 4. **Neon**
- **Pros**: Serverless PostgreSQL, generous free tier, instant branching
- **Cons**: Newer service, less mature than Vercel Postgres
- **Why not**: Less integration with Vercel ecosystem

### 5. **Self-hosted PostgreSQL**
- **Pros**: Full control, no vendor lock-in
- **Cons**: Requires server management, backup management, higher operational overhead
- **Why not**: Not cost-effective for small team, adds operational complexity

## Rationale

**Vercel Postgres** was chosen because:

1. **Seamless Vercel Integration**:
   - Native integration with Vercel platform
   - Automatic environment variable setup
   - Optimized for serverless environments
   - Connection pooling built-in

2. **Free Tier**:
   - 256MB storage (sufficient for ~100K submissions)
   - 60 hours compute/month (enough for moderate traffic)
   - No credit card required initially
   - Easy upgrade path when needed

3. **PostgreSQL Compatibility**:
   - Full PostgreSQL feature set
   - Compatible with Prisma ORM
   - Supports advanced features (JSON, arrays, full-text search if needed)

4. **Developer Experience**:
   - Simple setup via Vercel dashboard
   - Integrated with Vercel CLI
   - Good documentation
   - Same vendor as hosting (fewer moving parts)

5. **Performance**:
   - Connection pooling for serverless (critical for Next.js)
   - Low latency (same region as app)
   - Read replicas available on paid plans

6. **Prisma ORM Benefits**:
   - Type-safe database access (TypeScript)
   - Excellent migration system
   - Auto-completion in IDE
   - Prevents SQL injection
   - Database introspection and schema visualization

## Consequences

### Positive

- **Zero configuration**: Works out of the box with Vercel deployment
- **Type safety**: Prisma client provides full TypeScript support
- **Migrations**: Prisma migrations are easy to write and apply
- **Performance**: Connection pooling prevents serverless cold start issues
- **Cost**: Free tier covers initial deployment and moderate traffic
- **Monitoring**: Vercel dashboard provides basic database metrics

### Negative

- **Vendor lock-in**: Tied to Vercel ecosystem (though Postgres is standard)
- **Limited free tier**: Only 256MB storage and 60 hours compute
- **Less features than Supabase**: No built-in auth, real-time, or storage
- **Migration complexity**: Moving to another provider would require migration effort

### Mitigation Strategies

- **Vendor lock-in**: Use standard Postgres features, avoid Vercel-specific extensions
- **Storage limits**: Monitor usage, upgrade to Hobby tier ($5/month) when needed
- **Backup strategy**: Export database regularly, store migration files in Git

## Future Considerations

**Scaling path**:
1. **10K+ submissions**: Upgrade to Hobby tier ($5/month for 512MB)
2. **100K+ submissions**: Upgrade to Pro tier or consider dedicated Postgres (Supabase/Railway)
3. **1M+ submissions**: Implement data archiving, consider read replicas

**Alternative migration**:
- If Vercel Postgres becomes too expensive, migrate to Supabase or self-hosted
- Prisma makes this relatively painless (just change connection string)
- All migration files are in Git for reproducibility

## Related Decisions

- **ADR 002**: Age verification approach (requires database logging)
- **ADR 003**: Testing strategy (Prisma mocking in tests)

## References

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Serverless Postgres Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)

---

**Last Updated**: 2026-01-24
