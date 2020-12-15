using Microsoft.EntityFrameworkCore.Migrations;

namespace DoppelkopfApi.Migrations.NpsqlMigrations
{
    public partial class _20201215player : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BidKontra",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "BidRe",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "Massage",
                table: "TablePlayer");

            migrationBuilder.AddColumn<string>(
                name: "DutyAnnouncement",
                table: "TablePlayer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "TablePlayer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserIdRequestCanShowCarts",
                table: "TablePlayer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DutyAnnouncement",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "Message",
                table: "TablePlayer");

            migrationBuilder.DropColumn(
                name: "UserIdRequestCanShowCarts",
                table: "TablePlayer");

            migrationBuilder.AddColumn<bool>(
                name: "BidKontra",
                table: "TablePlayer",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "BidRe",
                table: "TablePlayer",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Massage",
                table: "TablePlayer",
                type: "text",
                nullable: true);
        }
    }
}
