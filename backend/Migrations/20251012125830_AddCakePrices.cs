using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CakeCatalogue.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCakePrices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CakePrices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CakeId = table.Column<int>(type: "int", nullable: false),
                    Size = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CakeId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CakePrices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CakePrices_Cakes_CakeId",
                        column: x => x.CakeId,
                        principalTable: "Cakes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CakePrices_Cakes_CakeId1",
                        column: x => x.CakeId1,
                        principalTable: "Cakes",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_CakePrices_CakeId_Size",
                table: "CakePrices",
                columns: new[] { "CakeId", "Size" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CakePrices_CakeId1",
                table: "CakePrices",
                column: "CakeId1");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CakePrices");
        }
    }
}
