namespace DailyLogTracker.Services;

using System.Collections.Generic;
using System.Threading.Tasks;
using DailyLogTracker.Data;
using DailyLogTracker.Models;
using Microsoft.EntityFrameworkCore;

public static class DailyLogSeeder
{
    private static readonly List<Employee> SeedEmployees = new()
    {
        new Employee { Name = "Alice Johnson", Role = "Employee" },
        new Employee { Name = "Ravi Patel", Role = "Employee" },
        new Employee { Name = "Maya Chen", Role = "Employee" },
        new Employee { Name = "Diego Morales", Role = "Manager" }
    };

    public static async Task SeedAsync(DailyLogContext context)
    {
        if (await context.Employees.AnyAsync())
        {
            return;
        }

        await context.Employees.AddRangeAsync(SeedEmployees);
        await context.SaveChangesAsync();
    }
}
