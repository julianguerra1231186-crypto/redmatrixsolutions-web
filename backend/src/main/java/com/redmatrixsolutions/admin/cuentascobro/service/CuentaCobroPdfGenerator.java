package com.redmatrixsolutions.admin.cuentascobro.service;

import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import com.redmatrixsolutions.admin.cuentascobro.model.CuentaCobro;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class CuentaCobroPdfGenerator {

    private static final Color NAVY = new Color(8, 25, 63);
    private static final Color RED = new Color(214, 0, 17);
    private static final Color GOLD = new Color(245, 197, 24);
    private static final Color LIGHT = new Color(247, 248, 252);
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy", new Locale("es", "CO"));
    private static final NumberFormat MONEY = NumberFormat.getCurrencyInstance(new Locale("es", "CO"));

    public byte[] generate(CuentaCobro cuenta) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.LETTER, 54, 54, 112, 92);
            PdfWriter writer = PdfWriter.getInstance(document, output);
            writer.setPageEvent(new CorporatePageEvent(asset("1.png"), asset("2.png")));

            document.open();
            addTrinityTemplate(document, cuenta);
            document.close();
            return output.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("No fue posible generar el PDF de la cuenta de cobro.", ex);
        }
    }

    private void addTrinityTemplate(Document document, CuentaCobro cuenta) throws Exception {
        BigDecimal valorPagar = cuenta.getValorPagar();
        BigDecimal valorTotal = cuenta.getValorTotalServicio();
        String valorPagarText = moneyText(valorPagar);
        String valorTotalText = moneyText(valorTotal);
        String valorPagarWords = moneyWords(valorPagar);
        String valorTotalWords = moneyWords(valorTotal);

        Paragraph title = new Paragraph("CUENTA DE COBRO No. " + cuenta.getNumero(), font(14, Font.BOLD, NAVY));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(8);
        document.add(title);

        Paragraph cityDate = new Paragraph("Neiva, Huila, " + DATE_FORMAT.format(cuenta.getFecha()), font(10, Font.NORMAL, Color.BLACK));
        cityDate.setSpacingAfter(14);
        document.add(cityDate);

        document.add(simpleParagraph("SEÑORES", Font.BOLD));
        document.add(simpleParagraph(cuenta.getCliente().toUpperCase(Locale.ROOT), Font.BOLD));
        document.add(simpleParagraph("Ciudad: Neiva-Huila", Font.NORMAL));
        document.add(Chunk.NEWLINE);

        document.add(labelInline("ASUNTO: ", "Cobro por servicios de creación y edición de contenido audiovisual para redes sociales."));
        document.add(Chunk.NEWLINE);

        document.add(bodyParagraph("Yo, JULIAN ANDRÉS GUERRA GARCÍA, identificado con cédula de ciudadanía No. 1000188124, me permito presentar la presente Cuenta de Cobro por concepto de prestación de servicios relacionados con la producción de contenido audiovisual para medios digitales y redes sociales."));

        document.add(sectionTitle("CONCEPTO DEL SERVICIO:"));
        document.add(bodyParagraph("Prestación de servicios de producción, grabación, edición y optimización de contenido audiovisual publicitario para las siguientes marcas:"));
        addPlainBullets(document, List.of("Lava Autos La 9", "Trinity FS", "Top Luxury Wash"));

        document.add(bodyParagraph("Dentro de las actividades desarrolladas se incluyen:"));
        addPlainBullets(document, List.of(
                "Grabación de material publicitario.",
                "Edición profesional de videos para redes sociales.",
                "Adaptación de formatos para Facebook, Instagram y WhatsApp.",
                "Optimización de piezas audiovisuales para campañas digitales.",
                "Entrega de contenido final listo para publicación."));

        document.add(sectionTitle("VALOR DEL SERVICIO"));
        document.add(bodyParagraph("Valor total acordado por la prestación de los servicios: " + valorTotalText));
        document.add(bodyParagraph("Valor correspondiente al primer pago acordado: " + valorPagarText));

        Paragraph valueTitle = sectionTitle("VALOR A PAGAR");
        valueTitle.setAlignment(Element.ALIGN_CENTER);
        document.add(valueTitle);
        Paragraph valueWords = new Paragraph(valorPagarWords + " M/CTE", font(11, Font.BOLD, NAVY));
        valueWords.setAlignment(Element.ALIGN_CENTER);
        valueWords.setSpacingAfter(4);
        document.add(valueWords);
        Paragraph valueAmount = new Paragraph(valorPagarText, font(13, Font.BOLD, NAVY));
        valueAmount.setAlignment(Element.ALIGN_CENTER);
        valueAmount.setSpacingAfter(10);
        document.add(valueAmount);

        document.add(sectionTitle("OBSERVACIÓN"));
        document.add(bodyParagraph("Las partes acuerdan que el valor total de los servicios prestados, equivalente a "
                + valorTotalWords + " M/CTE (" + valorTotalText + "), será cancelado en dos cuotas quincenales de "
                + valorPagarWords + " M/CTE (" + valorPagarText + ") cada una, con vencimiento los días 15 y 30 de junio de 2026. "
                + "La presente Cuenta de Cobro No. " + cuenta.getNumero() + " corresponde a la Segunda cuota pactada y presentada para su respectivo pago."));

        document.add(sectionTitle("DATOS PARA EL PAGO"));
        addPaymentData(document);
        addQrReference(document);
        document.add(bodyParagraph("Agradezco la atención prestada y quedo atento a la confirmación del pago correspondiente."));
        addTrinitySignature(document);
    }

    private Paragraph simpleParagraph(String text, int style) {
        Paragraph paragraph = new Paragraph(text, font(10, style, Color.BLACK));
        paragraph.setSpacingAfter(3);
        return paragraph;
    }

    private Paragraph bodyParagraph(String text) {
        Paragraph paragraph = new Paragraph(text, font(9, Font.NORMAL, Color.BLACK));
        paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
        paragraph.setLeading(12.5f);
        paragraph.setSpacingAfter(7);
        return paragraph;
    }

    private Paragraph labelInline(String label, String text) {
        Paragraph paragraph = new Paragraph();
        paragraph.add(new Chunk(label, font(10, Font.BOLD, Color.BLACK)));
        paragraph.add(new Chunk(text, font(10, Font.NORMAL, Color.BLACK)));
        paragraph.setSpacingAfter(8);
        return paragraph;
    }

    private void addPlainBullets(Document document, List<String> values) throws IOException {
        for (String value : values) {
            Paragraph item = new Paragraph("• " + value, font(9, Font.NORMAL, Color.BLACK));
            item.setIndentationLeft(18);
            item.setSpacingAfter(2);
            document.add(item);
        }
        document.add(Chunk.NEWLINE);
    }

    private void addPaymentData(Document document) throws Exception {
        PdfPTable table = table(1);
        table.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        PdfPCell details = new PdfPCell();
        details.setBorder(Rectangle.NO_BORDER);
        details.setPadding(0);
        details.addElement(bodyParagraph("Medio de pago: Llave Bre-B"));
        details.addElement(bodyParagraph("Número: 1000188124 (Documento de identidad)"));
        details.addElement(bodyParagraph("Titular de la cuenta: JULIAN ANDRÉS GUERRA GARCÍA"));
        details.addElement(bodyParagraph("C.C. No. 1000188124"));
        table.addCell(details);
        document.add(table);
    }

    private void addQrReference(Document document) throws Exception {
        Paragraph reference = new Paragraph("Imagen de referencia:", font(9, Font.NORMAL, Color.BLACK));
        reference.setSpacingAfter(4);
        document.add(reference);
        Path qrPath = asset("llaveBre-B.jpg");
        if (Files.exists(qrPath)) {
            Image qr = Image.getInstance(qrPath.toAbsolutePath().toString());
            qr.scaleToFit(74, 74);
            qr.setAlignment(Element.ALIGN_LEFT);
            document.add(qr);
        }
    }

    private void addTrinitySignature(Document document) throws Exception {
        document.add(Chunk.NEWLINE);
        document.add(simpleParagraph("Atentamente,", Font.NORMAL));
        Path signaturePath = asset("FirmaDigital.png");
        if (Files.exists(signaturePath)) {
            Image image = Image.getInstance(signaturePath.toAbsolutePath().toString());
            image.scaleToFit(130, 46);
            image.setAlignment(Element.ALIGN_LEFT);
            document.add(image);
        }
        document.add(simpleParagraph("Julian Andrés Guerra García", Font.NORMAL));
        document.add(simpleParagraph("C.C. No. 1000188124", Font.NORMAL));
        document.add(simpleParagraph("Firma: ___________________________", Font.NORMAL));
        Paragraph footer = new Paragraph("Neiva, Huila – Colombia", font(9, Font.NORMAL, Color.BLACK));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);
    }

    private String moneyText(BigDecimal value) {
        long amount = value == null ? 0L : value.longValue();
        return "$" + NumberFormat.getIntegerInstance(new Locale("es", "CO")).format(amount) + " COP";
    }

    private String moneyWords(BigDecimal value) {
        long amount = value == null ? 0L : value.longValue();
        return numberToSpanish(amount).toUpperCase(Locale.ROOT) + " PESOS";
    }

    private String numberToSpanish(long value) {
        if (value == 0) {
            return "cero";
        }
        if (value < 0) {
            return "menos " + numberToSpanish(Math.abs(value));
        }
        if (value < 1_000) {
            return hundredsToSpanish((int) value);
        }
        if (value < 1_000_000) {
            long thousands = value / 1_000;
            long rest = value % 1_000;
            String prefix = thousands == 1 ? "mil" : numberToSpanish(thousands) + " mil";
            return rest == 0 ? prefix : prefix + " " + hundredsToSpanish((int) rest);
        }
        if (value < 1_000_000_000) {
            long millions = value / 1_000_000;
            long rest = value % 1_000_000;
            String prefix = millions == 1 ? "un millon" : numberToSpanish(millions) + " millones";
            return rest == 0 ? prefix : prefix + " " + numberToSpanish(rest);
        }
        long billions = value / 1_000_000_000;
        long rest = value % 1_000_000_000;
        String prefix = billions == 1 ? "mil millones" : numberToSpanish(billions) + " mil millones";
        return rest == 0 ? prefix : prefix + " " + numberToSpanish(rest);
    }

    private String hundredsToSpanish(int value) {
        String[] units = {"", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
                "diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve",
                "veinte", "veintiuno", "veintidos", "veintitres", "veinticuatro", "veinticinco", "veintiseis", "veintisiete", "veintiocho", "veintinueve"};
        if (value < 30) {
            return units[value];
        }
        if (value < 100) {
            String[] tens = {"", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"};
            int ten = value / 10;
            int unit = value % 10;
            return unit == 0 ? tens[ten] : tens[ten] + " y " + units[unit];
        }
        if (value == 100) {
            return "cien";
        }
        String[] hundreds = {"", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"};
        int hundred = value / 100;
        int rest = value % 100;
        return rest == 0 ? hundreds[hundred] : hundreds[hundred] + " " + hundredsToSpanish(rest);
    }

    private void addTitle(Document document, CuentaCobro cuenta) throws IOException {
        Paragraph title = new Paragraph("CUENTA DE COBRO", font(18, Font.BOLD, NAVY));
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(6);
        document.add(title);

        PdfPTable meta = table(3);
        meta.setWidths(new float[]{1.2f, 1f, 1f});
        meta.addCell(labelValue("No.", cuenta.getNumero()));
        meta.addCell(labelValue("Ciudad", cuenta.getCiudad()));
        meta.addCell(labelValue("Fecha", DATE_FORMAT.format(cuenta.getFecha())));
        document.add(meta);
        document.add(Chunk.NEWLINE);
    }

    private void addClientBlock(Document document, CuentaCobro cuenta) throws IOException {
        PdfPTable table = table(2);
        table.setWidths(new float[]{1.2f, 2.8f});
        table.addCell(label("Cliente"));
        table.addCell(value(cuenta.getCliente()));
        table.addCell(label("Ciudad del cliente"));
        table.addCell(value(cuenta.getCiudadCliente()));
        table.addCell(label("Asunto"));
        table.addCell(value(cuenta.getAsunto()));
        document.add(table);
        document.add(Chunk.NEWLINE);
    }

    private void addSection(Document document, String title, String text) throws IOException {
        if (!StringUtils.hasText(text)) {
            return;
        }
        document.add(sectionTitle(title));
        Paragraph paragraph = new Paragraph(text.trim(), font(10, Font.NORMAL, Color.DARK_GRAY));
        paragraph.setAlignment(Element.ALIGN_JUSTIFIED);
        paragraph.setLeading(14);
        paragraph.setSpacingAfter(10);
        document.add(paragraph);
    }

    private void addListSection(Document document, String title, List<String> values) throws IOException {
        if (values == null || values.isEmpty()) {
            return;
        }
        document.add(sectionTitle(title));
        for (String value : values) {
            Paragraph item = new Paragraph("- " + value, font(10, Font.NORMAL, Color.DARK_GRAY));
            item.setIndentationLeft(10);
            item.setSpacingAfter(3);
            document.add(item);
        }
        document.add(Chunk.NEWLINE);
    }

    private void addValues(Document document, CuentaCobro cuenta) throws IOException {
        PdfPTable table = table(2);
        table.setWidths(new float[]{1f, 1f});
        table.addCell(amountCell("Valor total del servicio", cuenta.getValorTotalServicio(), false));
        table.addCell(amountCell("Valor a pagar", cuenta.getValorPagar(), true));
        document.add(table);
        document.add(Chunk.NEWLINE);
    }

    private void addPayment(Document document, CuentaCobro cuenta) throws IOException {
        document.add(sectionTitle("Datos para el pago"));
        PdfPTable table = table(2);
        table.setWidths(new float[]{2.4f, 1f});

        PdfPTable details = table(2);
        details.addCell(label("Medio de pago"));
        details.addCell(value(cuenta.getMedioPago()));
        details.addCell(label("Numero"));
        details.addCell(value(cuenta.getNumeroMedioPago()));
        details.addCell(label("Titular"));
        details.addCell(value(cuenta.getTitularCuenta()));
        details.addCell(label("Documento"));
        details.addCell(value(cuenta.getDocumentoIdentidad()));

        PdfPCell detailsCell = cell();
        detailsCell.addElement(details);
        table.addCell(detailsCell);

        PdfPCell qrCell = cell();
        qrCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        Path qrPath = asset("llaveBre-B.jpg");
        if (Files.exists(qrPath)) {
            Image qr = Image.getInstance(qrPath.toAbsolutePath().toString());
            qr.scaleToFit(90, 90);
            qr.setAlignment(Element.ALIGN_CENTER);
            qrCell.addElement(qr);
        }
        table.addCell(qrCell);
        document.add(table);
        document.add(Chunk.NEWLINE);
    }

    private void addSignature(Document document, CuentaCobro cuenta) throws Exception {
        PdfPTable table = table(1);
        PdfPCell signature = cell();
        signature.setHorizontalAlignment(Element.ALIGN_CENTER);
        Path signaturePath = asset("FirmaDigital.png");
        if (Files.exists(signaturePath)) {
            Image image = Image.getInstance(signaturePath.toAbsolutePath().toString());
            image.scaleToFit(165, 60);
            image.setAlignment(Element.ALIGN_CENTER);
            signature.addElement(image);
        }
        Paragraph line = new Paragraph("______________________________", font(10, Font.NORMAL, NAVY));
        line.setAlignment(Element.ALIGN_CENTER);
        signature.addElement(line);
        Paragraph name = new Paragraph(cuenta.getResponsable(), font(10, Font.BOLD, NAVY));
        name.setAlignment(Element.ALIGN_CENTER);
        signature.addElement(name);
        Paragraph documentId = new Paragraph("CC/NIT: " + cuenta.getDocumentoIdentidad(), font(9, Font.NORMAL, Color.DARK_GRAY));
        documentId.setAlignment(Element.ALIGN_CENTER);
        signature.addElement(documentId);
        Paragraph firmante = new Paragraph("Firma: " + cuenta.getFirma(), font(9, Font.NORMAL, Color.DARK_GRAY));
        firmante.setAlignment(Element.ALIGN_CENTER);
        signature.addElement(firmante);
        table.addCell(signature);
        document.add(table);
    }

    private Paragraph sectionTitle(String title) {
        Paragraph paragraph = new Paragraph(title.toUpperCase(Locale.ROOT), font(10, Font.BOLD, RED));
        paragraph.setSpacingBefore(4);
        paragraph.setSpacingAfter(5);
        return paragraph;
    }

    private PdfPCell labelValue(String label, String value) {
        PdfPCell cell = cell();
        Paragraph p = new Paragraph(label.toUpperCase(Locale.ROOT), font(8, Font.BOLD, RED));
        p.setSpacingAfter(2);
        cell.addElement(p);
        cell.addElement(new Paragraph(value, font(10, Font.BOLD, NAVY)));
        return cell;
    }

    private PdfPCell amountCell(String label, BigDecimal value, boolean featured) {
        PdfPCell cell = cell();
        cell.setBackgroundColor(featured ? NAVY : LIGHT);
        cell.addElement(new Paragraph(label.toUpperCase(Locale.ROOT), font(8, Font.BOLD, featured ? GOLD : RED)));
        cell.addElement(new Paragraph(MONEY.format(value), font(15, Font.BOLD, featured ? Color.WHITE : NAVY)));
        return cell;
    }

    private PdfPCell label(String text) {
        PdfPCell cell = cell();
        cell.setBackgroundColor(LIGHT);
        cell.addElement(new Phrase(text, font(9, Font.BOLD, NAVY)));
        return cell;
    }

    private PdfPCell value(String text) {
        PdfPCell cell = cell();
        cell.addElement(new Phrase(text, font(9, Font.NORMAL, Color.DARK_GRAY)));
        return cell;
    }

    private PdfPTable table(int columns) {
        PdfPTable table = new PdfPTable(columns);
        table.setWidthPercentage(100);
        table.setSpacingAfter(4);
        return table;
    }

    private PdfPCell cell() {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(7);
        cell.setBorderColor(new Color(218, 222, 232));
        cell.setBorderWidth(0.8f);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        return cell;
    }

    private Font font(int size, int style, Color color) {
        return new Font(Font.HELVETICA, size, style, color);
    }

    private Path asset(String fileName) {
        Path direct = Path.of("CuentasDeCobro", "ImaguenesCuentaDeCobro", fileName);
        if (Files.exists(direct)) {
            return direct;
        }
        return Path.of("backend", "CuentasDeCobro", "ImaguenesCuentaDeCobro", fileName);
    }

    private static class CorporatePageEvent extends PdfPageEventHelper {
        private final Path headerPath;
        private final Path footerPath;

        CorporatePageEvent(Path headerPath, Path footerPath) {
            this.headerPath = headerPath;
            this.footerPath = footerPath;
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            try {
                Rectangle page = document.getPageSize();
                drawImage(writer, headerPath, 0, page.getHeight() - 92, page.getWidth(), 92);
                drawImage(writer, footerPath, 0, 0, page.getWidth(), 84);
            } catch (Exception ignored) {
                // El PDF sigue siendo util aunque falte un recurso visual.
            }
        }

        private void drawImage(PdfWriter writer, Path path, float x, float y, float width, float height) throws Exception {
            if (!Files.exists(path)) {
                return;
            }
            Image image = Image.getInstance(path.toAbsolutePath().toString());
            image.scaleAbsolute(width, height);
            image.setAbsolutePosition(x, y);
            writer.getDirectContentUnder().addImage(image);
        }
    }
}
