package com.redmatrixsolutions.admin.cuentascobro.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cuentas_cobro", uniqueConstraints = {
        @UniqueConstraint(name = "uk_cuentas_cobro_numero", columnNames = "numero")
})
public class CuentaCobro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String numero;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false, length = 120)
    private String ciudad;

    @Column(nullable = false, length = 180)
    private String cliente;

    @Column(nullable = false, length = 120)
    private String ciudadCliente;

    @Column(nullable = false, length = 220)
    private String asunto;

    @Column(nullable = false, length = 1400)
    private String conceptoServicio;

    @ElementCollection
    @CollectionTable(name = "cuentas_cobro_marcas", joinColumns = @JoinColumn(name = "cuenta_cobro_id"))
    @Column(name = "marca_servicio", nullable = false, length = 220)
    private List<String> marcasServicios = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "cuentas_cobro_actividades", joinColumns = @JoinColumn(name = "cuenta_cobro_id"))
    @Column(name = "actividad", nullable = false, length = 500)
    private List<String> actividadesDesarrolladas = new ArrayList<>();

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal valorTotalServicio;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal valorPagar;

    @Column(length = 1200)
    private String observaciones;

    @Column(nullable = false, length = 120)
    private String medioPago;

    @Column(nullable = false, length = 120)
    private String numeroMedioPago;

    @Column(nullable = false, length = 180)
    private String titularCuenta;

    @Column(nullable = false, length = 80)
    private String documentoIdentidad;

    @Column(nullable = false, length = 180)
    private String responsable;

    @Column(nullable = false, length = 180)
    private String firma;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
