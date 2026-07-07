using DailyLogTracker.Data;
using DailyLogTracker.Dtos;
using DailyLogTracker.Models;
using DailyLogTracker.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<DailyLogContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("default", policy => policy
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DailyLogContext>();
    await db.Database.EnsureCreatedAsync();
    await DailyLogSeeder.SeedAsync(db);
}

app.UseCors("default");
app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/api/employees", async (DailyLogContext context) =>
{
    var employees = await context.Employees
        .Select(e => new EmployeeDto(e.Id, e.Name, e.Role))
        .ToListAsync();

    return Results.Ok(employees);
})
.WithName("GetEmployees");

app.MapGet("/api/logs", async (int? employeeId, DailyLogContext context) =>
{
    var query = context.DailyLogs.Include(l => l.Employee).AsQueryable();

    if (employeeId.HasValue)
    {
        query = query.Where(l => l.EmployeeId == employeeId.Value);
    }

    var logs = await query
        .OrderByDescending(l => l.Date)
        .ThenByDescending(l => l.CreatedAt)
        .Select(l => new DailyLogDto(
            l.Id,
            l.EmployeeId,
            l.Employee.Name,
            l.Date,
            l.Summary,
            l.Status,
            l.CreatedAt))
        .ToListAsync();

    return Results.Ok(logs);
})
.WithName("GetLogs");

app.MapPost("/api/logs", async (DailyLogCreateDto dto, DailyLogContext context) =>
{
    if (dto is null)
    {
        return Results.BadRequest("Request body is required.");
    }

    if (string.IsNullOrWhiteSpace(dto.Summary) || string.IsNullOrWhiteSpace(dto.Status))
    {
        return Results.BadRequest("Summary and status are required.");
    }

    var employee = await context.Employees.FindAsync(dto.EmployeeId);

    if (employee is null)
    {
        return Results.NotFound("Employee not found.");
    }

    var log = new DailyLog
    {
        EmployeeId = dto.EmployeeId,
        Date = dto.Date.Date,
        Summary = dto.Summary.Trim(),
        Status = dto.Status.Trim(),
        CreatedAt = DateTime.UtcNow
    };

    context.DailyLogs.Add(log);
    await context.SaveChangesAsync();

    var response = new DailyLogDto(
        log.Id,
        employee.Id,
        employee.Name,
        log.Date,
        log.Summary,
        log.Status,
        log.CreatedAt);

    return Results.Created($"/api/logs/{log.Id}", response);
})
.WithName("CreateLog");

app.Run();
