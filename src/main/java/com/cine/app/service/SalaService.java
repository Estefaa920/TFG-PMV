package com.cine.app.service;

import com.cine.app.domain.Sala;
import com.cine.app.repository.SalaRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Sala}.
 */
@Service
@Transactional
public class SalaService {

    private final Logger log = LoggerFactory.getLogger(SalaService.class);

    private final SalaRepository salaRepository;

    public SalaService(SalaRepository salaRepository) {
        this.salaRepository = salaRepository;
    }

    /**
     * Save a sala.
     *
     * @param sala the entity to save.
     * @return the persisted entity.
     */
    public Sala save(Sala sala) {
        log.debug("Request to save Sala : {}", sala);
        return salaRepository.save(sala);
    }

    /**
     * Partially update a sala.
     *
     * @param sala the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Sala> partialUpdate(Sala sala) {
        log.debug("Request to partially update Sala : {}", sala);

        return salaRepository
            .findById(sala.getId())
            .map(existingSala -> {
                if (sala.getNombre() != null) {
                    existingSala.setNombre(sala.getNombre());
                }

                return existingSala;
            })
            .map(salaRepository::save);
    }

    /**
     * Get all the salas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Sala> findAll(Pageable pageable) {
        log.debug("Request to get all Salas");
        return salaRepository.findAll(pageable);
    }

    /**
     * Get one sala by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Sala> findOne(Long id) {
        log.debug("Request to get Sala : {}", id);
        return salaRepository.findById(id);
    }

    /**
     * Delete the sala by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Sala : {}", id);
        salaRepository.deleteById(id);
    }
}
