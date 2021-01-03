using Microsoft.EntityFrameworkCore.Migrations;

namespace DoppelkopfApi.Migrations.NpsqlMigrations
{
    public partial class _20210101_Langauge : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LanguageKey",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LanguageKey",
                table: "Users");
        }
    }
}
