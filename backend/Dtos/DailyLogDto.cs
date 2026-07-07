namespace DailyLogTracker.Dtos;

using System;

public record DailyLogDto(int Id, int EmployeeId, string EmployeeName, DateTime Date, string Summary, string Status, DateTime CreatedAt);
