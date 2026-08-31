const ticketConfig = {
    alteracao_ra: {
        id: "alterar_ra",
        label: "Alterar RA cadastrado incorretamente",
        description: "Solicite a correção do RA cadastrado.",
        modalId: "ticket_modal_alterar_ra",
        titulo: "Alterar RA cadastrado",

        campos: [
            {
                id: "mensagem",
                label: "Descreva seu problema detalhadamente",
                placeholder: "Informe o que está incorreto e qual deveria ser o RA correto.",
                style: "Paragraph",
                required: true
            }
        ]
    },

    problema_tecnico: {
        id: "problema_tecnico",
        label: "Problema técnico no sistema",
        description: "Relate um erro ou falha no sistema.",
        modalId: "ticket_modal_problema_tecnico",
        titulo: "Problema técnico",

        campos: [
            {
                id: "mensagem",
                label: "Descreva seu problema detalhadamente",
                placeholder: "Explique o que aconteceu, onde ocorreu e, se possível, o que você estava fazendo.",
                style: "Paragraph",
                required: true
            }
        ]
    },

    problema_pagamento: {
        id: "pagamentos",
        label: "Problema com pagamentos ou assinatura",
        description: "Problemas relacionados a pagamentos ou assinatura.",
        modalId: "ticket_modal_pagamentos",
        titulo: "Pagamentos ou assinatura",

        campos: [
            {
                id: "mensagem",
                label: "Descreva seu problema detalhadamente",
                placeholder: "Informe o que aconteceu e, se relevante, o pagamento, assinatura ou cobrança envolvida.",
                style: "Paragraph",
                required: true
            }
        ]
    },

    outros: {
        id: "outros",
        label: "Outros problemas ou dúvidas",
        description: "Para assuntos que não se encaixam nas outras categorias.",
        modalId: "ticket_modal_outros",
        titulo: "Outros problemas ou dúvidas",

        campos: [
            {
                id: "mensagem",
                label: "Descreva seu problema detalhadamente",
                placeholder: "Explique sua dúvida ou problema da forma mais detalhada possível.",
                style: "Paragraph",
                required: true
            }
        ]
    }
};

module.exports = ticketConfig;