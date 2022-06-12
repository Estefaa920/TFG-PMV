package com.cine.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cine.app.IntegrationTest;
import com.cine.app.domain.Butaca;
import com.cine.app.repository.ButacaRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ButacaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ButacaResourceIT {

    private static final String DEFAULT_POSICION = "AAAAAAAAAA";
    private static final String UPDATED_POSICION = "BBBBBBBBBB";

    private static final Boolean DEFAULT_PREMIUM = false;
    private static final Boolean UPDATED_PREMIUM = true;

    private static final String ENTITY_API_URL = "/api/butacas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ButacaRepository butacaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restButacaMockMvc;

    private Butaca butaca;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Butaca createEntity(EntityManager em) {
        Butaca butaca = new Butaca().posicion(DEFAULT_POSICION).premium(DEFAULT_PREMIUM);
        return butaca;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Butaca createUpdatedEntity(EntityManager em) {
        Butaca butaca = new Butaca().posicion(UPDATED_POSICION).premium(UPDATED_PREMIUM);
        return butaca;
    }

    @BeforeEach
    public void initTest() {
        butaca = createEntity(em);
    }

    @Test
    @Transactional
    void createButaca() throws Exception {
        int databaseSizeBeforeCreate = butacaRepository.findAll().size();
        // Create the Butaca
        restButacaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(butaca)))
            .andExpect(status().isCreated());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeCreate + 1);
        Butaca testButaca = butacaList.get(butacaList.size() - 1);
        assertThat(testButaca.getPosicion()).isEqualTo(DEFAULT_POSICION);
        assertThat(testButaca.getPremium()).isEqualTo(DEFAULT_PREMIUM);
    }

    @Test
    @Transactional
    void createButacaWithExistingId() throws Exception {
        // Create the Butaca with an existing ID
        butaca.setId(1L);

        int databaseSizeBeforeCreate = butacaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restButacaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(butaca)))
            .andExpect(status().isBadRequest());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPosicionIsRequired() throws Exception {
        int databaseSizeBeforeTest = butacaRepository.findAll().size();
        // set the field null
        butaca.setPosicion(null);

        // Create the Butaca, which fails.

        restButacaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(butaca)))
            .andExpect(status().isBadRequest());

        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPremiumIsRequired() throws Exception {
        int databaseSizeBeforeTest = butacaRepository.findAll().size();
        // set the field null
        butaca.setPremium(null);

        // Create the Butaca, which fails.

        restButacaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(butaca)))
            .andExpect(status().isBadRequest());

        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllButacas() throws Exception {
        // Initialize the database
        butacaRepository.saveAndFlush(butaca);

        // Get all the butacaList
        restButacaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(butaca.getId().intValue())))
            .andExpect(jsonPath("$.[*].posicion").value(hasItem(DEFAULT_POSICION)))
            .andExpect(jsonPath("$.[*].premium").value(hasItem(DEFAULT_PREMIUM.booleanValue())));
    }

    @Test
    @Transactional
    void getButaca() throws Exception {
        // Initialize the database
        butacaRepository.saveAndFlush(butaca);

        // Get the butaca
        restButacaMockMvc
            .perform(get(ENTITY_API_URL_ID, butaca.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(butaca.getId().intValue()))
            .andExpect(jsonPath("$.posicion").value(DEFAULT_POSICION))
            .andExpect(jsonPath("$.premium").value(DEFAULT_PREMIUM.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingButaca() throws Exception {
        // Get the butaca
        restButacaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewButaca() throws Exception {
        // Initialize the database
        butacaRepository.saveAndFlush(butaca);

        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();

        // Update the butaca
        Butaca updatedButaca = butacaRepository.findById(butaca.getId()).get();
        // Disconnect from session so that the updates on updatedButaca are not directly saved in db
        em.detach(updatedButaca);
        updatedButaca.posicion(UPDATED_POSICION).premium(UPDATED_PREMIUM);

        restButacaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedButaca.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedButaca))
            )
            .andExpect(status().isOk());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
        Butaca testButaca = butacaList.get(butacaList.size() - 1);
        assertThat(testButaca.getPosicion()).isEqualTo(UPDATED_POSICION);
        assertThat(testButaca.getPremium()).isEqualTo(UPDATED_PREMIUM);
    }

    @Test
    @Transactional
    void putNonExistingButaca() throws Exception {
        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();
        butaca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restButacaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, butaca.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(butaca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchButaca() throws Exception {
        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();
        butaca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restButacaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(butaca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamButaca() throws Exception {
        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();
        butaca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restButacaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(butaca)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateButacaWithPatch() throws Exception {
        // Initialize the database
        butacaRepository.saveAndFlush(butaca);

        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();

        // Update the butaca using partial update
        Butaca partialUpdatedButaca = new Butaca();
        partialUpdatedButaca.setId(butaca.getId());

        restButacaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedButaca.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedButaca))
            )
            .andExpect(status().isOk());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
        Butaca testButaca = butacaList.get(butacaList.size() - 1);
        assertThat(testButaca.getPosicion()).isEqualTo(DEFAULT_POSICION);
        assertThat(testButaca.getPremium()).isEqualTo(DEFAULT_PREMIUM);
    }

    @Test
    @Transactional
    void fullUpdateButacaWithPatch() throws Exception {
        // Initialize the database
        butacaRepository.saveAndFlush(butaca);

        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();

        // Update the butaca using partial update
        Butaca partialUpdatedButaca = new Butaca();
        partialUpdatedButaca.setId(butaca.getId());

        partialUpdatedButaca.posicion(UPDATED_POSICION).premium(UPDATED_PREMIUM);

        restButacaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedButaca.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedButaca))
            )
            .andExpect(status().isOk());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
        Butaca testButaca = butacaList.get(butacaList.size() - 1);
        assertThat(testButaca.getPosicion()).isEqualTo(UPDATED_POSICION);
        assertThat(testButaca.getPremium()).isEqualTo(UPDATED_PREMIUM);
    }

    @Test
    @Transactional
    void patchNonExistingButaca() throws Exception {
        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();
        butaca.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restButacaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, butaca.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(butaca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchButaca() throws Exception {
        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();
        butaca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restButacaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(butaca))
            )
            .andExpect(status().isBadRequest());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamButaca() throws Exception {
        int databaseSizeBeforeUpdate = butacaRepository.findAll().size();
        butaca.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restButacaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(butaca)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Butaca in the database
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteButaca() throws Exception {
        // Initialize the database
        butacaRepository.saveAndFlush(butaca);

        int databaseSizeBeforeDelete = butacaRepository.findAll().size();

        // Delete the butaca
        restButacaMockMvc
            .perform(delete(ENTITY_API_URL_ID, butaca.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Butaca> butacaList = butacaRepository.findAll();
        assertThat(butacaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
