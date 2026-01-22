import { jsPDF } from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Order } from "../data/mock-admin-data";

// Type definition for jsPDF with autoTable
interface JSPDFWithAutoTable extends jsPDF {
    lastAutoTable?: { finalY: number };
}

export const exportOrdersToExcel = (orders: Order[], currency: string = "DH") => {
    const data = orders.map(order => ({
        "N° Commande": order.orderNumber,
        "Client": order.customerName,
        "Téléphone": order.phone,
        "Ville": order.city,
        "Adresse": order.address,
        [`Total (${currency})`]: order.total,
        "Status": order.status,
        "Date": new Date(order.createdAt).toLocaleDateString(),
        "Produits": order.items.map(item => `${item.product?.name} (x${item.quantity})`).join(", ")
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Commandes");

    // Generate buffer and save
    XLSX.writeFile(workbook, `Commandes_MKARIM_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportOrdersToPDF = (orders: Order[], currency: string = "DH") => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Liste des Commandes - MKARIM SOLUTION", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Généré le: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["N° Commande", "Client", "Ville", "Total", "Status", "Date"];
    const tableRows = orders.map(order => [
        order.orderNumber,
        order.customerName,
        order.city,
        `${order.total} ${currency}`,
        order.status,
        new Date(order.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [155, 135, 245] }
    });

    doc.save(`Commandes_MKARIM_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateInvoicePDF = (order: Order, currency: string = "DH") => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0);
    doc.text("FACTURE", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.text("MKARIM SOLUTION", 14, 40);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Vente de PC & Matériel Gaming", 14, 46);
    doc.text("Maroc", 14, 51);

    // Invoice Info
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text(`Facture N°: ${order.orderNumber}`, 140, 40);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 46);
    doc.text(`Status: ${order.status.toUpperCase()}`, 140, 52);

    // Customer Info
    doc.line(14, 60, 196, 60);
    doc.setFontSize(14);
    doc.text("Destinataire:", 14, 70);
    doc.setFontSize(11);
    doc.text(order.customerName, 14, 78);
    doc.text(order.phone, 14, 84);
    doc.text(`${order.address}, ${order.city}`, 14, 90);

    // Table
    const tableColumn = ["Produit", "Quantité", "Prix Unitaire", "Total"];
    const tableRows = order.items.map(item => [
        item.product?.name || "Produit Inconnu",
        item.quantity.toString(),
        `${item.price} ${currency}`,
        `${item.price * item.quantity} ${currency}`
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 100,
        theme: 'striped',
        headStyles: { fillColor: [155, 135, 245] },
        styles: { fontSize: 10 }
    });

    // Totals
    const finalYPos = (doc as JSPDFWithAutoTable).lastAutoTable?.finalY || 180;

    doc.setFontSize(12);
    doc.text(`Total HT: ${(order.total * 0.8).toFixed(2)} ${currency}`, 140, finalYPos + 10);
    doc.text(`TVA (20%): ${(order.total * 0.2).toFixed(2)} ${currency}`, 140, finalYPos + 17);
    doc.setFontSize(14);
    doc.text(`TOTAL TTC: ${order.total} ${currency}`, 140, finalYPos + 26);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Merci pour votre confiance !", 105, 280, { align: "center" });
    doc.text("MKARIM SOLUTION - www.mkarim.ma", 105, 285, { align: "center" });

    doc.save(`Facture_${order.orderNumber}.pdf`);
};
