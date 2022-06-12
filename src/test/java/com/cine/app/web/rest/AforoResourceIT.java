package com.cine.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cine.app.IntegrationTest;
import com.cine.app.domain.Aforo;
import com.cine.app.repository.AforoRepository;
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
 * Integration tests for the {@link AforoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AforoResourceIT {

    private static final Boolean DEFAULT_RESERVADA = false;
    private static final Boolean UPDATED_RESERVADA = true;

    private static final String ENTITY_API_URL = "/api/aforos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AforoRepository aforoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAforoMockMvc;

    private Aforo aforo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aforo createEntity(EntityManager em) {
        Aforo aforo = new Aforo().reservada(DEFAULT_RESERVADA);
        return aforo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Aforo createUpdatedEntity(EntityManager em) {
        Aforo aforo = new Aforo().reservada(UPDATED_RESERVADA);
        return aforo;
    }

    @BeforeEach
    public void initTest() {
        aforo = createEntity(em);
    }

    @Test
    @Transactional
    void createAforo() throws Exception {
        int databaseSizeBeforeCreate = aforoRepository.findAll().size();
        // Create the Aforo
        restAforoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aforo)))
            .andExpect(status().isCreated());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeCreate + 1);
        Aforo testAforo = aforoList.get(aforoList.size() - 1);
        assertThat(testAforo.getReservada()).isEqualTo(DEFAULT_RESERVADA);
    }

    @Test
    @Transactional
    void createAforoWithExistingId() throws Exception {
        // Create the Aforo with an existing ID
        aforo.setId(1L);

        int databaseSizeBeforeCreate = aforoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAforoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aforo)))
            .andExpect(status().isBadRequest());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkReservadaIsRequired() throws Exception {
        int databaseSizeBeforeTest = aforoRepository.findAll().size();
        // set the field null
        aforo.setReservada(null);

        // Create the Aforo, which fails.

        restAforoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aforo)))
            .andExpect(status().isBadRequest());

        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAforos() throws Exception {
        // Initialize the database
        aforoRepository.saveAndFlush(aforo);

        // Get all the aforoList
        restAforoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(aforo.getId().intValue())))
            .andExpect(jsonPath("$.[*].reservada").value(hasItem(DEFAULT_RESERVADA.booleanValue())));
    }

    @Test
    @Transactional
    void getAforo() throws Exception {
        // Initialize the database
        aforoRepository.saveAndFlush(aforo);

        // Get the aforo
        restAforoMockMvc
            .perform(get(ENTITY_API_URL_ID, aforo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(aforo.getId().intValue()))
            .andExpect(jsonPath("$.reservada").value(DEFAULT_RESERVADA.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingAforo() throws Exception {
        // Get the aforo
        restAforoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAforo() throws Exception {
        // Initialize the database
        aforoRepository.saveAndFlush(aforo);

        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();

        // Update the aforo
        Aforo updatedAforo = aforoRepository.findById(aforo.getId()).get();
        // Disconnect from session so that the updates on updatedAforo are not directly saved in db
        em.detach(updatedAforo);
        updatedAforo.reservada(UPDATED_RESERVADA);

        restAforoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAforo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAforo))
            )
            .andExpect(status().isOk());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
        Aforo testAforo = aforoList.get(aforoList.size() - 1);
        assertThat(testAforo.getReservada()).isEqualTo(UPDATED_RESERVADA);
    }

    @Test
    @Transactional
    void putNonExistingAforo() throws Exception {
        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();
        aforo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAforoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, aforo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(aforo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAforo() throws Exception {
        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();
        aforo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAforoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(aforo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAforo() throws Exception {
        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();
        aforo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAforoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(aforo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAforoWithPatch() throws Exception {
        // Initialize the database
        aforoRepository.saveAndFlush(aforo);

        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();

        // Update the aforo using partial update
        Aforo partialUpdatedAforo = new Aforo();
        partialUpdatedAforo.setId(aforo.getId());

        restAforoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAforo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAforo))
            )
            .andExpect(status().isOk());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
        Aforo testAforo = aforoList.get(aforoList.size() - 1);
        assertThat(testAforo.getReservada()).isEqualTo(DEFAULT_RESERVADA);
    }

    @Test
    @Transactional
    void fullUpdateAforoWithPatch() throws Exception {
        // Initialize the database
        aforoRepository.saveAndFlush(aforo);

        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();

        // Update the aforo using partial update
        Aforo partialUpdatedAforo = new Aforo();
        partialUpdatedAforo.setId(aforo.getId());

        partialUpdatedAforo.reservada(UPDATED_RESERVADA);

        restAforoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAforo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAforo))
            )
            .andExpect(status().isOk());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
        Aforo testAforo = aforoList.get(aforoList.size() - 1);
        assertThat(testAforo.getReservada()).isEqualTo(UPDATED_RESERVADA);
    }

    @Test
    @Transactional
    void patchNonExistingAforo() throws Exception {
        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();
        aforo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAforoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, aforo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aforo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAforo() throws Exception {
        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();
        aforo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAforoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(aforo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAforo() throws Exception {
        int databaseSizeBeforeUpdate = aforoRepository.findAll().size();
        aforo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAforoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(aforo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Aforo in the database
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAforo() throws Exception {
        // Initialize the database
        aforoRepository.saveAndFlush(aforo);

        int databaseSizeBeforeDelete = aforoRepository.findAll().size();

        // Delete the aforo
        restAforoMockMvc
            .perform(delete(ENTITY_API_URL_ID, aforo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Aforo> aforoList = aforoRepository.findAll();
        assertThat(aforoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
