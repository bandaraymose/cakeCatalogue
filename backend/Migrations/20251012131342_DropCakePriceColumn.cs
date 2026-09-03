using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CakeCatalogue.Api.Migrations
{
    /// <inheritdoc />
    public partial class DropCakePriceColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Cakes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Cakes",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
