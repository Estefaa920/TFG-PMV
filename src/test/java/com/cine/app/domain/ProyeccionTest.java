package com.cine.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cine.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProyeccionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Proyeccion.class);
        Proyeccion proyeccion1 = new Proyeccion();
        proyeccion1.setId(1L);
        Proyeccion proyeccion2 = new Proyeccion();
        proyeccion2.setId(proyeccion1.getId());
        assertThat(proyeccion1).isEqualTo(proyeccion2);
        proyeccion2.setId(2L);
        assertThat(proyeccion1).isNotEqualTo(proyeccion2);
        proyeccion1.setId(null);
        assertThat(proyeccion1).isNotEqualTo(proyeccion2);
    }
}
