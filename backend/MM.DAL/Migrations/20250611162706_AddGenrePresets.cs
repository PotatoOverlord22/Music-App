using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MM.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddGenrePresets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GenrePresets",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GenreName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UserGuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenrePresets", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_GenrePresets_Users_UserGuid",
                        column: x => x.UserGuid,
                        principalTable: "Users",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GenrePresetValues",
                columns: table => new
                {
                    Guid = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BandIndex = table.Column<int>(type: "int", nullable: false),
                    Gain = table.Column<float>(type: "real", nullable: false),
                    GenrePresetGuid = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GenrePresetValues", x => x.Guid);
                    table.ForeignKey(
                        name: "FK_GenrePresetValues_GenrePresets_GenrePresetGuid",
                        column: x => x.GenrePresetGuid,
                        principalTable: "GenrePresets",
                        principalColumn: "Guid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GenrePresets_UserGuid",
                table: "GenrePresets",
                column: "UserGuid");

            migrationBuilder.CreateIndex(
                name: "IX_GenrePresetValues_GenrePresetGuid",
                table: "GenrePresetValues",
                column: "GenrePresetGuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GenrePresetValues");

            migrationBuilder.DropTable(
                name: "GenrePresets");
        }
    }
}
