using Microsoft.EntityFrameworkCore.Migrations;

namespace DoppelkopfApi.Migrations.NpsqlMigrations
{
    public partial class _20201213viewer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AsAdditionPlayer",
                table: "TableViewers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SeePlayerCard",
                table: "TableViewers",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AsAdditionPlayer",
                table: "TableViewers");

            migrationBuilder.DropColumn(
                name: "SeePlayerCard",
                table: "TableViewers");
        }
    }
}
