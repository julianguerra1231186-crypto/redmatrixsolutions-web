package com.redmatrixsolutions.admin.cuentascobro.service;

import com.redmatrixsolutions.admin.cuentascobro.dto.CuentaCobroRequest;
import com.redmatrixsolutions.admin.cuentascobro.dto.CuentaCobroResponse;
import com.redmatrixsolutions.admin.cuentascobro.model.CuentaCobro;
import com.redmatrixsolutions.admin.cuentascobro.repository.CuentaCobroRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class CuentaCobroService {

    private final CuentaCobroRepository repository;

    public CuentaCobroService(CuentaCobroRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<CuentaCobroResponse> findAll(String search, LocalDate fecha) {
        if (fecha != null) {
            return repository.findByFechaOrderByNumeroAsc(fecha).stream().map(this::toResponse).toList();
        }
        if (StringUtils.hasText(search)) {
            String cleaned = search.trim();
            return repository
                    .findByNumeroContainingIgnoreCaseOrClienteContainingIgnoreCaseOrderByFechaDesc(cleaned, cleaned)
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }
        return repository.findAllByOrderByFechaDescCreatedAtDesc().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CuentaCobro findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No existe la cuenta de cobro solicitada."));
    }

    @Transactional(readOnly = true)
    public CuentaCobroResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @Transactional
    public CuentaCobroResponse create(CuentaCobroRequest request) {
        if (repository.existsByNumeroIgnoreCase(request.getNumero().trim())) {
            throw new DataIntegrityViolationException("El numero de cuenta de cobro ya existe.");
        }
        CuentaCobro entity = new CuentaCobro();
        applyRequest(entity, request);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public CuentaCobroResponse update(Long id, CuentaCobroRequest request) {
        CuentaCobro entity = findEntity(id);
        if (repository.existsByNumeroIgnoreCaseAndIdNot(request.getNumero().trim(), id)) {
            throw new DataIntegrityViolationException("El numero de cuenta de cobro ya existe.");
        }
        applyRequest(entity, request);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("No existe la cuenta de cobro solicitada.");
        }
        repository.deleteById(id);
    }

    private void applyRequest(CuentaCobro entity, CuentaCobroRequest request) {
        entity.setNumero(clean(request.getNumero()));
        entity.setFecha(request.getFecha());
        entity.setCiudad(clean(request.getCiudad()));
        entity.setCliente(clean(request.getCliente()));
        entity.setCiudadCliente(clean(request.getCiudadCliente()));
        entity.setAsunto(clean(request.getAsunto()));
        entity.setConceptoServicio(clean(request.getConceptoServicio()));
        entity.setMarcasServicios(cleanList(request.getMarcasServicios()));
        entity.setActividadesDesarrolladas(cleanList(request.getActividadesDesarrolladas()));
        entity.setValorTotalServicio(request.getValorTotalServicio());
        entity.setValorPagar(request.getValorPagar());
        entity.setObservaciones(cleanNullable(request.getObservaciones()));
        entity.setMedioPago(clean(request.getMedioPago()));
        entity.setNumeroMedioPago(clean(request.getNumeroMedioPago()));
        entity.setTitularCuenta(clean(request.getTitularCuenta()));
        entity.setDocumentoIdentidad(clean(request.getDocumentoIdentidad()));
        entity.setResponsable(clean(request.getResponsable()));
        entity.setFirma(clean(request.getFirma()));
    }

    private CuentaCobroResponse toResponse(CuentaCobro entity) {
        return new CuentaCobroResponse(
                entity.getId(),
                entity.getNumero(),
                entity.getFecha(),
                entity.getCiudad(),
                entity.getCliente(),
                entity.getCiudadCliente(),
                entity.getAsunto(),
                entity.getConceptoServicio(),
                List.copyOf(entity.getMarcasServicios()),
                List.copyOf(entity.getActividadesDesarrolladas()),
                entity.getValorTotalServicio(),
                entity.getValorPagar(),
                entity.getObservaciones(),
                entity.getMedioPago(),
                entity.getNumeroMedioPago(),
                entity.getTitularCuenta(),
                entity.getDocumentoIdentidad(),
                entity.getResponsable(),
                entity.getFirma(),
                entity.getCreatedAt(),
                entity.getUpdatedAt());
    }

    private List<String> cleanList(List<String> values) {
        if (values == null) {
            return List.of();
        }
        return values.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .toList();
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    private String cleanNullable(String value) {
        return StringUtils.hasText(value) ? value.trim() : "";
    }
}
