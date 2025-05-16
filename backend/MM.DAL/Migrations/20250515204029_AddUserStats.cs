using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MM.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddUserStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserStats",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserGuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TransformedSongs = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TransformedSongsWithContext = table.Column<int>(type: "int", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserStats", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_UserStats_Users_UserGuid",
                        column: x => x.UserGuid,
                        principalTable: "Users",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserStats_UserGuid",
                table: "UserStats",
                column: "UserGuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserStats");
        }
    }
}
