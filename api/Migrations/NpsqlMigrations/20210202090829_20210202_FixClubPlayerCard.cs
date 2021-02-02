using Microsoft.EntityFrameworkCore.Migrations;

namespace DoppelkopfApi.Migrations.NpsqlMigrations
{
    public partial class _20210202_FixClubPlayerCard : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasDiamondClubsOnHand",
                table: "TablePlayer");

            migrationBuilder.AddColumn<bool>(
                name: "HasClubsQueenOnHand",
                table: "TablePlayer",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasClubsQueenOnHand",
                table: "TablePlayer");

            migrationBuilder.AddColumn<bool>(
                name: "HasDiamondClubsOnHand",
                table: "TablePlayer",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
