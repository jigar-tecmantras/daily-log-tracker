namespace DailyLogTracker.Models;

using System.Collections.Generic;

public class Employee
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Role { get; set; } = "Employee";

    public ICollection<DailyLog> DailyLogs { get; set; } = new List<DailyLog>();
}
