package com.redmatrixsolutions.admin.cuentascobro.repository;

import com.redmatrixsolutions.admin.cuentascobro.model.CuentaCobro;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CuentaCobroRepository extends JpaRepository<CuentaCobro, Long> {

    boolean existsByNumeroIgnoreCase(String numero);

    boolean existsByNumeroIgnoreCaseAndIdNot(String numero, Long id);

    List<CuentaCobro> findByNumeroContainingIgnoreCaseOrClienteContainingIgnoreCaseOrderByFechaDesc(
            String numero, String cliente);

    List<CuentaCobro> findByFechaOrderByNumeroAsc(LocalDate fecha);

    List<CuentaCobro> findAllByOrderByFechaDescCreatedAtDesc();
}
