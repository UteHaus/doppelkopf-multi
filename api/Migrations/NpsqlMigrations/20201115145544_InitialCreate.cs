using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace DoppelkopfApi.Migrations.NpsqlMigrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlayTables",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    CurrentPlayerPosition = table.Column<int>(nullable: false),
                    RoundCardsGiversPosition = table.Column<int>(nullable: false),
                    RoundCount = table.Column<int>(nullable: false),
                    StitchCounter = table.Column<int>(nullable: false),
                    RunStarted = table.Column<DateTime>(nullable: false),
                    SilentForPlayer = table.Column<int>(nullable: false),
                    GameVariant = table.Column<int>(nullable: false),
                    WithNiner = table.Column<bool>(nullable: false),
                    LastCardSet = table.Column<string>(nullable: true),
                    LastUpdate = table.Column<DateTime>(nullable: false),
                    DiamondsAceAsMaster = table.Column<bool>(nullable: false),
                    WeddingWithFirstColorCast = table.Column<bool>(nullable: false),
                    TableIcon = table.Column<string>(nullable: true),
                    AdditionalWeddingPlayerId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayTables", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TablePlayer",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TableId = table.Column<int>(nullable: false),
                    PlayerId = table.Column<int>(nullable: false),
                    Username = table.Column<string>(nullable: true),
                    PlayerPosition = table.Column<int>(nullable: false),
                    HandCards = table.Column<string>(nullable: true),
                    RoundsPoints = table.Column<int>(nullable: false),
                    GameVariant = table.Column<int>(nullable: false),
                    PlayedCard = table.Column<string>(nullable: true),
                    ShuffleRound = table.Column<bool>(nullable: false),
                    NextTurn = table.Column<bool>(nullable: false),
                    HasDiamondClubsOnHand = table.Column<bool>(nullable: false),
                    WinnedRounds = table.Column<int>(nullable: false),
                    RoundWinner = table.Column<bool>(nullable: false),
                    AnnouncementVersusParty = table.Column<bool>(nullable: false),
                    AnnouncementReParty = table.Column<bool>(nullable: false),
                    CancellationOfparty = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TablePlayer", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true),
                    Username = table.Column<string>(nullable: true),
                    PasswordHash = table.Column<byte[]>(nullable: true),
                    PasswordSalt = table.Column<byte[]>(nullable: true),
                    Icon = table.Column<string>(nullable: true),
                    Admin = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlayTables");

            migrationBuilder.DropTable(
                name: "TablePlayer");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
