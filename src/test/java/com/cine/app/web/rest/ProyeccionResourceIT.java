package com.cine.app.web.rest;

import static com.cine.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.cine.app.IntegrationTest;
import com.cine.app.domain.Proyeccion;
import com.cine.app.repository.ProyeccionRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link ProyeccionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProyeccionResourceIT {

    private static final ZonedDateTime DEFAULT_FECHA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FECHA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_PRECIO = 1D;
    private static final Double UPDATED_PRECIO = 2D;

    private static final String ENTITY_API_URL = "/api/proyeccions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProyeccionRepository proyeccionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProyeccionMockMvc;

    private Proyeccion proyeccion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proyeccion createEntity(EntityManager em) {
        Proyeccion proyeccion = new Proyeccion().fecha(DEFAULT_FECHA).precio(DEFAULT_PRECIO);
        return proyeccion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proyeccion createUpdatedEntity(EntityManager em) {
        Proyeccion proyeccion = new Proyeccion().fecha(UPDATED_FECHA).precio(UPDATED_PRECIO);
        return proyeccion;
    }

    @BeforeEach
    public void initTest() {
        proyeccion = createEntity(em);
    }

    @Test
    @Transactional
    void createProyeccion() throws Exception {
        int databaseSizeBeforeCreate = proyeccionRepository.findAll().size();
        // Create the Proyeccion
        restProyeccionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyeccion)))
            .andExpect(status().isCreated());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeCreate + 1);
        Proyeccion testProyeccion = proyeccionList.get(proyeccionList.size() - 1);
        assertThat(testProyeccion.getFecha()).isEqualTo(DEFAULT_FECHA);
        assertThat(testProyeccion.getPrecio()).isEqualTo(DEFAULT_PRECIO);
    }

    @Test
    @Transactional
    void createProyeccionWithExistingId() throws Exception {
        // Create the Proyeccion with an existing ID
        proyeccion.setId(1L);

        int databaseSizeBeforeCreate = proyeccionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProyeccionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyeccion)))
            .andExpect(status().isBadRequest());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFechaIsRequired() throws Exception {
        int databaseSizeBeforeTest = proyeccionRepository.findAll().size();
        // set the field null
        proyeccion.setFecha(null);

        // Create the Proyeccion, which fails.

        restProyeccionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyeccion)))
            .andExpect(status().isBadRequest());

        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrecioIsRequired() throws Exception {
        int databaseSizeBeforeTest = proyeccionRepository.findAll().size();
        // set the field null
        proyeccion.setPrecio(null);

        // Create the Proyeccion, which fails.

        restProyeccionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyeccion)))
            .andExpect(status().isBadRequest());

        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProyeccions() throws Exception {
        // Initialize the database
        proyeccionRepository.saveAndFlush(proyeccion);

        // Get all the proyeccionList
        restProyeccionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proyeccion.getId().intValue())))
            .andExpect(jsonPath("$.[*].fecha").value(hasItem(sameInstant(DEFAULT_FECHA))))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())));
    }

    @Test
    @Transactional
    void getProyeccion() throws Exception {
        // Initialize the database
        proyeccionRepository.saveAndFlush(proyeccion);

        // Get the proyeccion
        restProyeccionMockMvc
            .perform(get(ENTITY_API_URL_ID, proyeccion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(proyeccion.getId().intValue()))
            .andExpect(jsonPath("$.fecha").value(sameInstant(DEFAULT_FECHA)))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingProyeccion() throws Exception {
        // Get the proyeccion
        restProyeccionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProyeccion() throws Exception {
        // Initialize the database
        proyeccionRepository.saveAndFlush(proyeccion);

        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();

        // Update the proyeccion
        Proyeccion updatedProyeccion = proyeccionRepository.findById(proyeccion.getId()).get();
        // Disconnect from session so that the updates on updatedProyeccion are not directly saved in db
        em.detach(updatedProyeccion);
        updatedProyeccion.fecha(UPDATED_FECHA).precio(UPDATED_PRECIO);

        restProyeccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProyeccion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProyeccion))
            )
            .andExpect(status().isOk());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
        Proyeccion testProyeccion = proyeccionList.get(proyeccionList.size() - 1);
        assertThat(testProyeccion.getFecha()).isEqualTo(UPDATED_FECHA);
        assertThat(testProyeccion.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void putNonExistingProyeccion() throws Exception {
        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();
        proyeccion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProyeccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, proyeccion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proyeccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProyeccion() throws Exception {
        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();
        proyeccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyeccionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proyeccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProyeccion() throws Exception {
        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();
        proyeccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyeccionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyeccion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProyeccionWithPatch() throws Exception {
        // Initialize the database
        proyeccionRepository.saveAndFlush(proyeccion);

        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();

        // Update the proyeccion using partial update
        Proyeccion partialUpdatedProyeccion = new Proyeccion();
        partialUpdatedProyeccion.setId(proyeccion.getId());

        partialUpdatedProyeccion.precio(UPDATED_PRECIO);

        restProyeccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProyeccion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProyeccion))
            )
            .andExpect(status().isOk());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
        Proyeccion testProyeccion = proyeccionList.get(proyeccionList.size() - 1);
        assertThat(testProyeccion.getFecha()).isEqualTo(DEFAULT_FECHA);
        assertThat(testProyeccion.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void fullUpdateProyeccionWithPatch() throws Exception {
        // Initialize the database
        proyeccionRepository.saveAndFlush(proyeccion);

        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();

        // Update the proyeccion using partial update
        Proyeccion partialUpdatedProyeccion = new Proyeccion();
        partialUpdatedProyeccion.setId(proyeccion.getId());

        partialUpdatedProyeccion.fecha(UPDATED_FECHA).precio(UPDATED_PRECIO);

        restProyeccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProyeccion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProyeccion))
            )
            .andExpect(status().isOk());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
        Proyeccion testProyeccion = proyeccionList.get(proyeccionList.size() - 1);
        assertThat(testProyeccion.getFecha()).isEqualTo(UPDATED_FECHA);
        assertThat(testProyeccion.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void patchNonExistingProyeccion() throws Exception {
        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();
        proyeccion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProyeccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, proyeccion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proyeccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProyeccion() throws Exception {
        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();
        proyeccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyeccionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proyeccion))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProyeccion() throws Exception {
        int databaseSizeBeforeUpdate = proyeccionRepository.findAll().size();
        proyeccion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyeccionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(proyeccion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proyeccion in the database
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProyeccion() throws Exception {
        // Initialize the database
        proyeccionRepository.saveAndFlush(proyeccion);

        int databaseSizeBeforeDelete = proyeccionRepository.findAll().size();

        // Delete the proyeccion
        restProyeccionMockMvc
            .perform(delete(ENTITY_API_URL_ID, proyeccion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Proyeccion> proyeccionList = proyeccionRepository.findAll();
        assertThat(proyeccionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
