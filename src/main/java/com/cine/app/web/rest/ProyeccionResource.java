package com.cine.app.web.rest;

import com.cine.app.domain.Butaca;
import com.cine.app.domain.Proyeccion;
import com.cine.app.domain.Sala;
import com.cine.app.repository.ProyeccionRepository;
import com.cine.app.service.AforoService;
import com.cine.app.service.ButacaService;
import com.cine.app.service.ProyeccionService;
import com.cine.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.cine.app.domain.Proyeccion}.
 */
@RestController
@RequestMapping("/api")
public class ProyeccionResource {

    private final Logger log = LoggerFactory.getLogger(ProyeccionResource.class);

    private static final String ENTITY_NAME = "proyeccion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProyeccionService proyeccionService;
    private final ButacaService butacaService;
    private final AforoService aforoService;

    private final ProyeccionRepository proyeccionRepository;

    public ProyeccionResource(
        ProyeccionService proyeccionService,
        ProyeccionRepository proyeccionRepository,
        ButacaService butacaService,
        AforoService aforoService
    ) {
        this.proyeccionService = proyeccionService;
        this.proyeccionRepository = proyeccionRepository;
        this.butacaService = butacaService;
        this.aforoService = aforoService;
    }

    /**
     * {@code POST  /proyeccions} : Create a new proyeccion.
     *
     * @param proyeccion the proyeccion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new proyeccion, or with status {@code 400 (Bad Request)} if
     *         the proyeccion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/proyeccions")
    public ResponseEntity<Proyeccion> createProyeccion(@Valid @RequestBody Proyeccion proyeccion) throws URISyntaxException {
        log.debug("REST request to save Proyeccion : {}", proyeccion);
        if (proyeccion.getId() != null) {
            throw new BadRequestAlertException("A new proyeccion cannot already have an ID", ENTITY_NAME, "idexists");
        }

        List<Butaca> entradas = new ArrayList<Butaca>();
        entradas = butacaService.findAllSala2(proyeccion.getSala());

        if (entradas.size() != 0 && entradas != null) {
            Proyeccion result = proyeccionService.save(proyeccion);
            if (result != null) {
                aforoService.generarEntrada(entradas, result);

                return ResponseEntity
                    .created(new URI("/api/proyeccions/" + result.getId()))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                    .body(result);
            }
        }

        return null;
    }

    /**
     * {@code PUT  /proyeccions/:id} : Updates an existing proyeccion.
     *
     * @param id         the id of the proyeccion to save.
     * @param proyeccion the proyeccion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated proyeccion,
     *         or with status {@code 400 (Bad Request)} if the proyeccion is not
     *         valid,
     *         or with status {@code 500 (Internal Server Error)} if the proyeccion
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/proyeccions/{id}")
    public ResponseEntity<Proyeccion> updateProyeccion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Proyeccion proyeccion
    ) throws URISyntaxException {
        log.debug("REST request to update Proyeccion : {}, {}", id, proyeccion);
        if (proyeccion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proyeccion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proyeccionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Proyeccion result = proyeccionService.save(proyeccion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, proyeccion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /proyeccions/:id} : Partial updates given fields of an existing
     * proyeccion, field will ignore if it is null
     *
     * @param id         the id of the proyeccion to save.
     * @param proyeccion the proyeccion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated proyeccion,
     *         or with status {@code 400 (Bad Request)} if the proyeccion is not
     *         valid,
     *         or with status {@code 404 (Not Found)} if the proyeccion is not
     *         found,
     *         or with status {@code 500 (Internal Server Error)} if the proyeccion
     *         couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/proyeccions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Proyeccion> partialUpdateProyeccion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Proyeccion proyeccion
    ) throws URISyntaxException {
        log.debug("REST request to partial update Proyeccion partially : {}, {}", id, proyeccion);
        if (proyeccion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proyeccion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proyeccionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Proyeccion> result = proyeccionService.partialUpdate(proyeccion);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, proyeccion.getId().toString())
        );
    }

    /**
     * {@code GET  /proyeccions} : get all the proyeccions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of proyeccions in body.
     */
    @GetMapping("/proyeccions")
    public ResponseEntity<List<Proyeccion>> getAllProyeccions(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Proyeccions");
        Page<Proyeccion> page = proyeccionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/proyeccions/id_pelicula/{id_pelicula}")
    public ResponseEntity<List<Proyeccion>> getProyeccionsByPelicula(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @PathVariable Long id_pelicula
    ) {
        log.debug("REST request to get a page of Proyeccions by Pelicula id");

        return ResponseEntity.ok().body(proyeccionService.findAllByPelicula(id_pelicula));
    }

    @GetMapping("/proyeccions/all/fecha")
    public ResponseEntity<List<Proyeccion>> getProyeccions(String fecha) {
        log.debug("REST request to get a page of Proyeccions by Pelicula id");
        List<Proyeccion> proyec = proyeccionService.findProyeccionFecha(fecha);

        return ResponseEntity.ok().body(proyec);
    }

    /**
     * {@code GET  /proyeccions/:id} : get the "id" proyeccion.
     *
     * @param id the id of the proyeccion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the proyeccion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/proyeccions/{id}")
    public ResponseEntity<Proyeccion> getProyeccion(@PathVariable Long id) {
        log.debug("REST request to get Proyeccion : {}", id);
        Optional<Proyeccion> proyeccion = proyeccionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(proyeccion);
    }

    /**
     * {@code DELETE  /proyeccions/:id} : delete the "id" proyeccion.
     *
     * @param id the id of the proyeccion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/proyeccions/{id}")
    public ResponseEntity<Void> deleteProyeccion(@PathVariable Long id) {
        log.debug("REST request to delete Proyeccion : {}", id);
        proyeccionService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
