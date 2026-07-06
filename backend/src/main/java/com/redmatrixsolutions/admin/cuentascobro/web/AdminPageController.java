package com.redmatrixsolutions.admin.cuentascobro.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminPageController {

    @GetMapping("/admin/cuentas-cobro")
    public String cuentasCobro() {
        return "forward:/admin/cuentas-cobro.html";
    }
}
