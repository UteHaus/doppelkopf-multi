using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DoppelkopfApi.Migrations.NpsqlMigrations
{
    public partial class _20201119_TableView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "BidKontra",
                table: "TablePlayer",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "BidRe",
                table: "TablePlayer",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Massage",
                table: "TablePlayer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlayedRoundCards",
                table: "TablePlayer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SecondDullStitches",
                table: "TablePlayer",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "TableViewers",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    tableId = table.Column<int>(nullable: false),
                    userId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TableViewers", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TableViewers");

            migrationBuilder.DropColumn(
                name: "BidKontra",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "BidRe",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "Massage",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "PlayedRoundCards",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "SecondDullStitches",
                table: "TablePlayer");
        }
    }
}
