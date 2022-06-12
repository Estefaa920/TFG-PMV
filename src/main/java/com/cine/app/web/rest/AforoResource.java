package com.cine.app.web.rest;

import com.cine.app.domain.Aforo;
import com.cine.app.repository.AforoRepository;
import com.cine.app.service.AforoService;
import com.cine.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
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
 * REST controller for managing {@link com.cine.app.domain.Aforo}.
 */
@RestController
@RequestMapping("/api")
public class AforoResource {

    private final Logger log = LoggerFactory.getLogger(AforoResource.class);

    private static final String ENTITY_NAME = "aforo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AforoService aforoService;

    private final AforoRepository aforoRepository;

    public AforoResource(AforoService aforoService, AforoRepository aforoRepository) {
        this.aforoService = aforoService;
        this.aforoRepository = aforoRepository;
    }

    /**
     * {@code POST  /aforos} : Create a new aforo.
     *
     * @param aforo the aforo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new aforo, or with status {@code 400 (Bad Request)} if the aforo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/aforos")
    public ResponseEntity<Aforo> createAforo(@Valid @RequestBody Aforo aforo) throws URISyntaxException {
        log.debug("REST request to save Aforo : {}", aforo);
        if (aforo.getId() != null) {
            throw new BadRequestAlertException("A new aforo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Aforo result = aforoService.save(aforo);
        return ResponseEntity
            .created(new URI("/api/aforos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /aforos/:id} : Updates an existing aforo.
     *
     * @param id the id of the aforo to save.
     * @param aforo the aforo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aforo,
     * or with status {@code 400 (Bad Request)} if the aforo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the aforo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/aforos/{id}")
    public ResponseEntity<Aforo> updateAforo(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Aforo aforo)
        throws URISyntaxException {
        log.debug("REST request to update Aforo : {}, {}", id, aforo);
        if (aforo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aforo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aforoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Aforo result = aforoService.save(aforo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aforo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /aforos/:id} : Partial updates given fields of an existing aforo, field will ignore if it is null
     *
     * @param id the id of the aforo to save.
     * @param aforo the aforo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated aforo,
     * or with status {@code 400 (Bad Request)} if the aforo is not valid,
     * or with status {@code 404 (Not Found)} if the aforo is not found,
     * or with status {@code 500 (Internal Server Error)} if the aforo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/aforos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Aforo> partialUpdateAforo(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Aforo aforo
    ) throws URISyntaxException {
        log.debug("REST request to partial update Aforo partially : {}, {}", id, aforo);
        if (aforo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, aforo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!aforoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Aforo> result = aforoService.partialUpdate(aforo);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, aforo.getId().toString())
        );
    }

    /**
     * {@code GET  /aforos} : get all the aforos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of aforos in body.
     */
    @GetMapping("/aforos")
    public ResponseEntity<List<Aforo>> getAllAforos(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Aforos");
        Page<Aforo> page = aforoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/aforos/butacas")
    public ResponseEntity<List<Aforo>> getAllAforosButacas(Long numeroProyeccion) {
        log.debug("REST request to get a page of Aforos!!! PASA POR BUSCAR ENTRADAS");
        return ResponseEntity.ok().body(aforoService.buscarEntradas(numeroProyeccion));
    }

    /**
     * {@code GET  /aforos/:id} : get the "id" aforo.
     *
     * @param id the id of the aforo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the aforo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/aforos/{id}")
    public ResponseEntity<Aforo> getAforo(@PathVariable Long id) {
        log.debug("REST request to get Aforo : {}", id);
        Optional<Aforo> aforo = aforoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(aforo);
    }

    /**
     * {@code DELETE  /aforos/:id} : delete the "id" aforo.
     *
     * @param id the id of the aforo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/aforos/{id}")
    public ResponseEntity<Void> deleteAforo(@PathVariable Long id) {
        log.debug("REST request to delete Aforo : {}", id);
        aforoService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
