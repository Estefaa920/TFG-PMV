package com.cine.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cine.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ButacaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Butaca.class);
        Butaca butaca1 = new Butaca();
        butaca1.setId(1L);
        Butaca butaca2 = new Butaca();
        butaca2.setId(butaca1.getId());
        assertThat(butaca1).isEqualTo(butaca2);
        butaca2.setId(2L);
        assertThat(butaca1).isNotEqualTo(butaca2);
        butaca1.setId(null);
        assertThat(butaca1).isNotEqualTo(butaca2);
    }
}
