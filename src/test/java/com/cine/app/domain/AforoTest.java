package com.cine.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cine.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AforoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Aforo.class);
        Aforo aforo1 = new Aforo();
        aforo1.setId(1L);
        Aforo aforo2 = new Aforo();
        aforo2.setId(aforo1.getId());
        assertThat(aforo1).isEqualTo(aforo2);
        aforo2.setId(2L);
        assertThat(aforo1).isNotEqualTo(aforo2);
        aforo1.setId(null);
        assertThat(aforo1).isNotEqualTo(aforo2);
    }
}
