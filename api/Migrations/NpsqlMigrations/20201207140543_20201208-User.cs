using Microsoft.EntityFrameworkCore.Migrations;

namespace DoppelkopfApi.Migrations.NpsqlMigrations
{
    public partial class _20201208User : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EditTables",
                table: "Users",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EditUser",
                table: "Users",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EditTables",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "EditUser",
                table: "Users");
        }
    }
}
