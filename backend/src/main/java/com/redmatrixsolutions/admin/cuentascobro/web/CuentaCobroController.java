package com.redmatrixsolutions.admin.cuentascobro.web;

import com.redmatrixsolutions.admin.cuentascobro.dto.CuentaCobroRequest;
import com.redmatrixsolutions.admin.cuentascobro.dto.CuentaCobroResponse;
import com.redmatrixsolutions.admin.cuentascobro.model.CuentaCobro;
import com.redmatrixsolutions.admin.cuentascobro.service.CuentaCobroPdfGenerator;
import com.redmatrixsolutions.admin.cuentascobro.service.CuentaCobroService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/cuentas-cobro")
public class CuentaCobroController {

    private final CuentaCobroService service;
    private final CuentaCobroPdfGenerator pdfGenerator;

    public CuentaCobroController(CuentaCobroService service, CuentaCobroPdfGenerator pdfGenerator) {
        this.service = service;
        this.pdfGenerator = pdfGenerator;
    }

    @GetMapping
    public List<CuentaCobroResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return service.findAll(search, fecha);
    }

    @GetMapping("/{id}")
    public CuentaCobroResponse get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public CuentaCobroResponse create(@Valid @RequestBody CuentaCobroRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public CuentaCobroResponse update(@PathVariable Long id, @Valid @RequestBody CuentaCobroRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) {
        CuentaCobro cuenta = service.findEntity(id);
        byte[] pdf = pdfGenerator.generate(cuenta);
        String fileName = "Cuenta-de-Cobro-" + cuenta.getNumero().replaceAll("[^a-zA-Z0-9_-]", "-") + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(fileName).build().toString())
                .body(pdf);
    }
}
