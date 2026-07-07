namespace DailyLogTracker.Data;

using DailyLogTracker.Models;
using Microsoft.EntityFrameworkCore;

public class DailyLogContext : DbContext
{
    public DailyLogContext(DbContextOptions<DailyLogContext> options)
        : base(options)
    {
    }

    public DbSet<Employee> Employees => Set<Employee>();

    public DbSet<DailyLog> DailyLogs => Set<DailyLog>();
}
