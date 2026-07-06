package com.redmatrixsolutions.admin.cuentascobro.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CuentaCobroRequest {

    @NotBlank
    @Size(max = 60)
    private String numero;

    @NotNull
    private LocalDate fecha;

    @NotBlank
    @Size(max = 120)
    private String ciudad;

    @NotBlank
    @Size(max = 180)
    private String cliente;

    @NotBlank
    @Size(max = 120)
    private String ciudadCliente;

    @NotBlank
    @Size(max = 220)
    private String asunto;

    @NotBlank
    @Size(max = 1400)
    private String conceptoServicio;

    private List<@NotBlank @Size(max = 220) String> marcasServicios;

    private List<@NotBlank @Size(max = 500) String> actividadesDesarrolladas;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal valorTotalServicio;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal valorPagar;

    @Size(max = 1200)
    private String observaciones;

    @NotBlank
    @Size(max = 120)
    private String medioPago;

    @NotBlank
    @Size(max = 120)
    private String numeroMedioPago;

    @NotBlank
    @Size(max = 180)
    private String titularCuenta;

    @NotBlank
    @Size(max = 80)
    private String documentoIdentidad;

    @NotBlank
    @Size(max = 180)
    private String responsable;

    @NotBlank
    @Size(max = 180)
    private String firma;

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getCiudadCliente() {
        return ciudadCliente;
    }

    public void setCiudadCliente(String ciudadCliente) {
        this.ciudadCliente = ciudadCliente;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getConceptoServicio() {
        return conceptoServicio;
    }

    public void setConceptoServicio(String conceptoServicio) {
        this.conceptoServicio = conceptoServicio;
    }

    public List<String> getMarcasServicios() {
        return marcasServicios;
    }

    public void setMarcasServicios(List<String> marcasServicios) {
        this.marcasServicios = marcasServicios;
    }

    public List<String> getActividadesDesarrolladas() {
        return actividadesDesarrolladas;
    }

    public void setActividadesDesarrolladas(List<String> actividadesDesarrolladas) {
        this.actividadesDesarrolladas = actividadesDesarrolladas;
    }

    public BigDecimal getValorTotalServicio() {
        return valorTotalServicio;
    }

    public void setValorTotalServicio(BigDecimal valorTotalServicio) {
        this.valorTotalServicio = valorTotalServicio;
    }

    public BigDecimal getValorPagar() {
        return valorPagar;
    }

    public void setValorPagar(BigDecimal valorPagar) {
        this.valorPagar = valorPagar;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getMedioPago() {
        return medioPago;
    }

    public void setMedioPago(String medioPago) {
        this.medioPago = medioPago;
    }

    public String getNumeroMedioPago() {
        return numeroMedioPago;
    }

    public void setNumeroMedioPago(String numeroMedioPago) {
        this.numeroMedioPago = numeroMedioPago;
    }

    public String getTitularCuenta() {
        return titularCuenta;
    }

    public void setTitularCuenta(String titularCuenta) {
        this.titularCuenta = titularCuenta;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public String getFirma() {
        return firma;
    }

    public void setFirma(String firma) {
        this.firma = firma;
    }
}
