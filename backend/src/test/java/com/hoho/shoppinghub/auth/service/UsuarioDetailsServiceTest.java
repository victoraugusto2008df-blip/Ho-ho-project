package com.hoho.shoppinghub.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.hoho.shoppinghub.auth.domain.Usuario;
import com.hoho.shoppinghub.auth.domain.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.GrantedAuthority;

@ExtendWith(MockitoExtension.class)
class UsuarioDetailsServiceTest {

    @Mock
    private UsuarioRepository repository;

    @Test
    void mapsEachRoleToRolePrefixedAuthority() {
        UsuarioDetailsService service = new UsuarioDetailsService(repository);
        Usuario consumidor = usuarioComRole("CONSUMIDOR");
        Usuario lojista = usuarioComRole("LOJISTA");
        Usuario admin = usuarioComRole("ADMIN_SHOPPING");

        when(repository.findByEmail("consumidor@shopping.com")).thenReturn(Optional.of(consumidor));
        when(repository.findByEmail("lojista@shopping.com")).thenReturn(Optional.of(lojista));
        when(repository.findByEmail("admin@shopping.com")).thenReturn(Optional.of(admin));

        assertThat(authorities(service, "consumidor@shopping.com")).containsExactly("ROLE_CONSUMIDOR");
        assertThat(authorities(service, "lojista@shopping.com")).containsExactly("ROLE_LOJISTA");
        assertThat(authorities(service, "admin@shopping.com")).containsExactly("ROLE_ADMIN_SHOPPING");
    }

    private static List<String> authorities(UsuarioDetailsService service, String email) {
        return service.loadUserByUsername(email).getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
    }

    private static Usuario usuarioComRole(String role) {
        Usuario usuario = mock(Usuario.class);
        when(usuario.getRole()).thenReturn(role);
        return usuario;
    }
}
