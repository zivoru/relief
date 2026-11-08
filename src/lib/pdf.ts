import PDFDocument from "pdfkit";
import type { CalcResult } from "@/lib/quiz/types";
import type { GeneratedPlan } from "@/lib/llm/schema";

export async function renderPlanPdf(
  calc: CalcResult,
  plan: GeneratedPlan,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text("Рельеф — план сушки без потери мышц", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#444").text(plan.summary, { align: "left" });
    doc.moveDown();
    doc.fillColor("#000").fontSize(12).text("Цифры");
    doc.fontSize(10).fillColor("#333").text(
      `Жир: ${calc.bodyFatPct}% · ОБМ: ${calc.lbmKg} кг · Белок: ${calc.proteinG} г · Калории фазы: ${calc.dietCalories} · Поддержка: ${calc.maintenanceCalories}`,
    );
    doc.text(`Фаза: ${calc.phaseLabel}`);
    doc.moveDown();

    doc.fillColor("#000").fontSize(12).text("Меню на 14 дней");
    for (const day of plan.menu) {
      doc
        .fontSize(11)
        .fillColor("#000")
        .text(`День ${day.day}${day.isRefeed ? " — рефид" : ""}`);
      for (const meal of day.meals) {
        doc
          .fontSize(9)
          .fillColor("#333")
          .text(`• ${meal.name} (${meal.proteinG} г белка) — ${meal.ingredients.join(", ")}`);
      }
      doc.moveDown(0.3);
    }

    doc.addPage();
    doc.fillColor("#000").fontSize(12).text("Список покупок");
    for (const item of plan.shoppingList) {
      doc.fontSize(10).text(`• ${item.item} — ${item.amount}`);
    }
    doc.moveDown();
    doc.fontSize(12).text("Тренировки");
    for (const w of plan.workouts) {
      doc.fontSize(11).text(w.name);
      doc.fontSize(9).fillColor("#555").text(w.when);
      for (const ex of w.exercises) {
        doc.fillColor("#333").text(`• ${ex.name}: ${ex.sets} × ${ex.reps}`);
      }
      doc.moveDown(0.4);
    }
    doc.moveDown();
    doc.fillColor("#000").fontSize(12).text("Выход из диеты");
    for (const step of plan.exitPlan.steps) {
      doc.fontSize(10).text(`• ${step}`);
    }
    doc.moveDown();
    doc.fontSize(8).fillColor("#888").text(
      "Материал носит информационный характер и не является медицинской рекомендацией.",
    );
    doc.end();
  });
}
