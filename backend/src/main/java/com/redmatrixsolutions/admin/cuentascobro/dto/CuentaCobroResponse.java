package com.redmatrixsolutions.admin.cuentascobro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record CuentaCobroResponse(
        Long id,
        String numero,
        LocalDate fecha,
        String ciudad,
        String cliente,
        String ciudadCliente,
        String asunto,
        String conceptoServicio,
        List<String> marcasServicios,
        List<String> actividadesDesarrolladas,
        BigDecimal valorTotalServicio,
        BigDecimal valorPagar,
        String observaciones,
        String medioPago,
        String numeroMedioPago,
        String titularCuenta,
        String documentoIdentidad,
        String responsable,
        String firma,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {
}
