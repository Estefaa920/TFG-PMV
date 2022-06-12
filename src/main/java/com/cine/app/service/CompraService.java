package com.cine.app.service;

import com.cine.app.domain.Compra;
import com.cine.app.repository.CompraRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Compra}.
 */
@Service
@Transactional
public class CompraService {

    private final Logger log = LoggerFactory.getLogger(CompraService.class);

    private final CompraRepository compraRepository;

    public CompraService(CompraRepository compraRepository) {
        this.compraRepository = compraRepository;
    }

    /**
     * Save a compra.
     *
     * @param compra the entity to save.
     * @return the persisted entity.
     */
    public Compra save(Compra compra) {
        log.debug("Request to save Compra : {}", compra);
        return compraRepository.save(compra);
    }

    /**
     * Partially update a compra.
     *
     * @param compra the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Compra> partialUpdate(Compra compra) {
        log.debug("Request to partially update Compra : {}", compra);

        return compraRepository
            .findById(compra.getId())
            .map(existingCompra -> {
                if (compra.getNombre() != null) {
                    existingCompra.setNombre(compra.getNombre());
                }
                if (compra.getDni() != null) {
                    existingCompra.setDni(compra.getDni());
                }
                if (compra.getPrecioTotal() != null) {
                    existingCompra.setPrecioTotal(compra.getPrecioTotal());
                }

                return existingCompra;
            })
            .map(compraRepository::save);
    }

    /**
     * Get all the compras.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Compra> findAll(Pageable pageable) {
        log.debug("Request to get all Compras");
        return compraRepository.findAll(pageable);
    }

    /**
     * Get one compra by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Compra> findOne(Long id) {
        log.debug("Request to get Compra : {}", id);
        return compraRepository.findById(id);
    }

    /**
     * Delete the compra by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Compra : {}", id);
        compraRepository.deleteById(id);
    }
}
