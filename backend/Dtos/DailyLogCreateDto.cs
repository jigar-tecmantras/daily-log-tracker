namespace DailyLogTracker.Dtos;

using System;

public record DailyLogCreateDto(int EmployeeId, DateTime Date, string Summary, string Status);
