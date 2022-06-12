package com.cine.app.web.rest;

import com.cine.app.domain.Butaca;
import com.cine.app.repository.ButacaRepository;
import com.cine.app.service.ButacaService;
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
 * REST controller for managing {@link com.cine.app.domain.Butaca}.
 */
@RestController
@RequestMapping("/api")
public class ButacaResource {

    private final Logger log = LoggerFactory.getLogger(ButacaResource.class);

    private static final String ENTITY_NAME = "butaca";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ButacaService butacaService;

    private final ButacaRepository butacaRepository;

    public ButacaResource(ButacaService butacaService, ButacaRepository butacaRepository) {
        this.butacaService = butacaService;
        this.butacaRepository = butacaRepository;
    }

    /**
     * {@code POST  /butacas} : Create a new butaca.
     *
     * @param butaca the butaca to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new butaca, or with status {@code 400 (Bad Request)} if the butaca has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/butacas")
    public ResponseEntity<Butaca> createButaca(@Valid @RequestBody Butaca butaca) throws URISyntaxException {
        log.debug("REST request to save Butaca : {}", butaca);
        if (butaca.getId() != null) {
            throw new BadRequestAlertException("A new butaca cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Butaca result = butacaService.save(butaca);
        return ResponseEntity
            .created(new URI("/api/butacas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /butacas/:id} : Updates an existing butaca.
     *
     * @param id the id of the butaca to save.
     * @param butaca the butaca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated butaca,
     * or with status {@code 400 (Bad Request)} if the butaca is not valid,
     * or with status {@code 500 (Internal Server Error)} if the butaca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/butacas/{id}")
    public ResponseEntity<Butaca> updateButaca(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Butaca butaca
    ) throws URISyntaxException {
        log.debug("REST request to update Butaca : {}, {}", id, butaca);
        if (butaca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, butaca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!butacaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Butaca result = butacaService.save(butaca);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, butaca.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /butacas/:id} : Partial updates given fields of an existing butaca, field will ignore if it is null
     *
     * @param id the id of the butaca to save.
     * @param butaca the butaca to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated butaca,
     * or with status {@code 400 (Bad Request)} if the butaca is not valid,
     * or with status {@code 404 (Not Found)} if the butaca is not found,
     * or with status {@code 500 (Internal Server Error)} if the butaca couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/butacas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Butaca> partialUpdateButaca(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Butaca butaca
    ) throws URISyntaxException {
        log.debug("REST request to partial update Butaca partially : {}, {}", id, butaca);
        if (butaca.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, butaca.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!butacaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Butaca> result = butacaService.partialUpdate(butaca);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, butaca.getId().toString())
        );
    }

    /**
     * {@code GET  /butacas} : get all the butacas.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of butacas in body.
     */
    @GetMapping("/butacas")
    public ResponseEntity<List<Butaca>> getAllButacas(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Butacas");
        Page<Butaca> page = butacaService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/butacas/sala")
    public ResponseEntity<List<Butaca>> getAllButacasSala( @org.springdoc.api.annotations.ParameterObject Long numeroSala) {
        log.debug(" !!!!!! REST request to get a page of Butacas resorurce  " + numeroSala );

        
        return ResponseEntity.ok().body(butacaService.findAllSala(numeroSala));
    }

    /**
     * {@code GET  /butacas/:id} : get the "id" butaca.
     *
     * @param id the id of the butaca to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the butaca, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/butacas/{id}")
    public ResponseEntity<Butaca> getButaca(@PathVariable Long id) {
        log.debug("REST request to get Butaca : {}", id);
        Optional<Butaca> butaca = butacaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(butaca);
    }

    /**
     * {@code DELETE  /butacas/:id} : delete the "id" butaca.
     *
     * @param id the id of the butaca to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/butacas/{id}")
    public ResponseEntity<Void> deleteButaca(@PathVariable Long id) {
        log.debug("REST request to delete Butaca : {}", id);
        butacaService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
