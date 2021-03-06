if (undefined === OpenMiamMiam) {
    var OpenMiamMiam = {};
}


OpenMiamMiam.ActionInSelectForm = function() {

    var object = function() {
        this.handleSubmit();
    };

    object.prototype = {
        handleSubmit: function() {
            $('form[data-type=action-in-select]').submit(function(e) {
                var form = $(this);
                form.attr('action', form.find('select').val());
            });
        }
    };

    return object;
}();


OpenMiamMiam.UrlSwitcherSelect = function() {

    var object = function() {
        this.handleSwitcher();
    };

    object.prototype = {
        handleSwitcher: function() {
            $('select[data-type=url-switcher]').change(function() {
                window.location = $(this).val();
            });
        }
    };

    return object;
}();


OpenMiamMiam.PanelForm = function() {

    var object = function() {
        this.handleErrors();
    };

    object.prototype = {
        handleErrors: function() {
            var panelsInError = $('.panel:has(.has-error)')
                .removeClass('panel-primary')
                .addClass('panel-danger');
        }
    };

    return object;
}();

OpenMiamMiam.ProducerProductForm = function() {

    var object = function() {
        this.handlePrice();
        this.handleAvailability();
    };

    object.prototype = {
        handlePrice: function() {
            $('#open_miam_miam_product_hasNoPrice').change(function() {
                $('#open_miam_miam_product_price').prop(
                    'disabled',
                    $(this).is(':checked')
                )
            }).trigger('change');
        },

        handleAvailability: function() {
            //
            // Stock
            //

            // stock input (to be moved)
            var stockInput  = $('#open_miam_miam_product_stock');
            var stockErrors = stockInput.siblings('ul.list-errors');

            // radio (target) and parent label
            var availabilityInStockId    = 'open_miam_miam_product_availability_1';
            var availabilityInStockRadio = $('#'+availabilityInStockId);
            var availabilityInStockLabel = availabilityInStockRadio.parent();

            // Moves input next to radio
            var stockPlaceholderId = 'open_miam_miam_product_stock_placeholder';
            availabilityInStockLabel.html(function(index, oldhtml) {
                return oldhtml.replace(/%stock%/i, '<div id="'+stockPlaceholderId+'"></div>');
            });

            // Reloads
            availabilityInStockRadio = $('#'+availabilityInStockId);

            // Moves errors if exists
            if (0 < stockErrors.size()) {
                availabilityInStockRadio.before(stockErrors);
                availabilityInStockRadio.parents('.checkbox:first').addClass('has-error');
            }

            // Deletes old form-group
            var stockFormGroup = stockInput.parents('.form-group:first');
            $('#'+stockPlaceholderId).replaceWith(stockInput);
            stockFormGroup.remove();

            // Creates labels for each text node and removes parent label
            availabilityInStockLabel.contents().filter(function() {
                return this.nodeType === 3;
            }).wrap(availabilityInStockLabel.clone().empty().attr('for', availabilityInStockId));
            availabilityInStockLabel.replaceWith(availabilityInStockLabel.children());

            // Select radio on focus
            stockInput.focus(function() {
                $(this).siblings(':radio:first').trigger('click');
            });


            //
            // Available at
            //

            // availableAt selects (to be moved)
            var availableAtSelects = $('select[name*="open_miam_miam_product[availableAt]"]');
            var availableAtErrors  = availableAtSelects.first().parent().siblings('ul.list-errors');

            // radio (target) and parent label
            var availabilityAvailableAtId    = 'open_miam_miam_product_availability_2';
            var availabilityAvailableAtRadio = $('#'+availabilityAvailableAtId);
            var availabilityAvailableAtLabel = availabilityAvailableAtRadio.parent();

            // Moves selects next to radio
            var datePlaceholderId = 'open_miam_miam_product_stock_placeholder';
            availabilityAvailableAtLabel.html(function(index, oldhtml) {
                return oldhtml.replace(/%date%/i, '<div id="'+datePlaceholderId+'"></div>');
            });

            // Reloads
            availabilityAvailableAtRadio = $('#'+availabilityAvailableAtId);

            // Moves errors if exists
            if (0 < availableAtErrors.size()) {
                availabilityAvailableAtRadio.before(availableAtErrors);
                availabilityAvailableAtRadio.parents('.checkbox:first').addClass('has-error');
            }

            // Deletes old form-group
            var availableAtFormGroup = availableAtSelects.parents('.form-group:first');
            $('#'+datePlaceholderId).replaceWith(availableAtSelects);
            availableAtFormGroup.remove();

            // Creates labels for each text node and removes parent label
            availabilityAvailableAtLabel.contents().filter(function() {
                return this.nodeType === 3;
            }).wrap(availabilityAvailableAtLabel.clone().empty().attr('for', availabilityAvailableAtId));
            availabilityAvailableAtLabel.replaceWith(availabilityAvailableAtLabel.children());

            // Selects radio on focus
            availableAtSelects.focus(function() {
                $(this).siblings(':radio:first').trigger('click');
            });


            //
            // Common
            //

            // Moves focus to input/select and enable/disable (CSS class only)
            $(':radio[name="open_miam_miam_product[availability]"]').change(function() {
                if (availabilityInStockRadio.is(':checked')) {
                    stockInput
                        .removeClass('disabled')
                        .trigger('focus');
                } else {
                    stockInput.addClass('disabled');
                }

                if ($('#open_miam_miam_product_availability_2').is(':checked')) {
                    availableAtSelects.removeClass('disabled')
                    availableAtSelects.first().trigger('focus');
                } else {
                    availableAtSelects.addClass('disabled');
                }
            }).trigger('change');
        }
    };

    return object;
}();


OpenMiamMiam.DeleteDialog = function() {
    var object = function() {
        this.handleConfirmation();

    };
    object.prototype = {
        handleConfirmation: function() {
            $('[href=#delete-dialog]').on('click', function(e) {
                e.preventDefault();

                $('#delete-dialog .btn-danger').attr('href', $(this).data('url'));
            });
        }
    };

    return object;
}();


OpenMiamMiam.SalesOrderForm = function() {
    var object = function() {
        this.addProductsModal = $('#add-products-dialog');
        this.editionFormFieldsContainer = $('#edition-form-fields-container');
        this.addArtificialProductFormId = 'add-artificial-product-form';
        this.filterProductsFormId = 'filter-products-form';
        this.keyUpDelay = 400;
        this.lastId = 0;
        this.currentValues = {};
        this.loader = $('<img src="/bundles/isicsopenmiammiam/img/loader.gif" class="loader" />');

        this.initialize();
    };

    object.prototype = {
        initialize: function() {
            var that = this;

            this.addProductsModal.delegate('a.add-product-link', 'click', function(e){
                $.ajax({
                    url: this.href,
                    success: function(html) {
                        $('#'+$(html).attr('id')).replaceWith($(html));
                        that.refreshEditionFormFieldsContainer();
                    }
                });

                e.preventDefault();
            });

            this.addProductsModal.delegate('ul.pagination a', 'click', function(e){
                if (!$(this).parent().hasClass('disabled')) {
                    $.ajax({
                        url: $(this).attr('href'),
                        data: $('#'+that.filterProductsFormId).serialize(),
                        type: 'post'
                    })
                    .done(function(response){
                        that.addProductsModal.find('tbody').html(response);
                    });
                }

                e.preventDefault();
            });

            this.addProductsModal.delegate('form', 'submit', function(e){
                var form = $(this);
                var promise = $.ajax({
                    type: 'post',
                    url: this.action,
                    data: $(this).serialize()
                });

                promise.done(function(){
                    form.find('.loader').remove();
                });

                if ($(this).attr('id') == that.addArtificialProductFormId) {
                    promise.done(function(html) {
                        that.addProductsModal.find('form:first').html(html);
                        that.refreshEditionFormFieldsContainer();
                    });
                    promise.fail(function(xhr){
                        that.addProductsModal.find('form:first').html(xhr.responseText);
                    });
                }

                if ($(this).attr('id') == that.filterProductsFormId) {
                    promise.done(function(html) {
                        that.addProductsModal.find('tbody').html(html);
                    });
                }

                e.preventDefault();
            });

            this.addProductsModal.delegate('form#'+this.filterProductsFormId+' select', 'change', function(){
                var $this = $(this);
                $('#'+that.filterProductsFormId).submit();
                if ($this.nextAll('.loader').size() === 0){
                  $this.after(that.loader.clone());
                }
            });

            this.addProductsModal.delegate('form#'+this.filterProductsFormId+' input[type="text"]', 'focus', function(){
                var $this = $(this);
                if (undefined === $this.data('id')) {
                    var id = that.lastId++;
                    $this.data('id', id);
                }
                that.currentValues[$this.data('id')] = $this.val();
            });

            this.addProductsModal.delegate('form#'+this.filterProductsFormId+' input[type="text"]', 'keydown', function(){
                var $this = $(this);

                if (that.currentValues[$this.data('id')] != $this.val()) {
                    if ($this.nextAll('.loader').size() === 0){
                        $this.after(that.loader.clone());
                    }
                }
            });

            this.addProductsModal.delegate('form#'+this.filterProductsFormId+' input[type="text"]', 'keyup', function(){
                var $this = $(this);

                if (that.keyUpTimer !== undefined) {
                    clearTimeout(that.keyUpTimer);
                }

                if (that.currentValues[$this.data('id')] != $this.val()) {
                    if ($this.nextAll('.loader').size() === 0){
                        $this.after(that.loader.clone());
                    }
                }

                that.keyUpTimer = setTimeout(function() {
                    if (that.currentValues[$this.data('id')] != $this.val()) {
                        $('#'+that.filterProductsFormId).submit();
                    } else {
                        $this.nextAll('.loader').remove();
                    }
                    that.currentValues[$this.data('id')] = $this.val();
                }, that.keyUpDelay);

            });

            this.initializeControls();

        },

        initializeControls: function() {
            new OpenMiamMiam.Quantity;
            new OpenMiamMiam.DeleteDialog;
        },

        refreshEditionFormFieldsContainer: function(){
            var that = this;
            $.ajax({
                url: this.editionFormFieldsContainer.data('refresh-url'),
                success: function(html){
                    that.editionFormFieldsContainer.html(html);
                    that.initializeControls();
                }
            });
        }
    };

    return object;
}();


OpenMiamMiam.AdminManagerAutocomplete = function() {
    var object = function(promote_url_schema) {
        this.promoteUrlSchema = promote_url_schema;

        $('#open_miam_miam_search_search').hide();
    };

    object.prototype = {
        handleAutocomplete: function() {
            var that = this;

            var $input = $('#open_miam_miam_search_keyword');
            var $form = $('#open_miam_miam_search_form');

            var $hiddenDiv = $('<div style="display: none"></div>');
            var $loader = $('<img src="/bundles/isicsopenmiammiam/img/loader.gif" class="loader"/>');

            $form.submit(function(e) {
                e.preventDefault();
            });

            $input.autocomplete({
                source: function(request, response) {
                    $.ajax({
                        url: $form.attr('action'),
                        dataType: 'json',
                        data: $form.serialize(),
                        success: function(data) {
                            response($.map(data, function(item) {
                                return $.extend(item, {
                                    label: that.formatItem(item)
                                });
                            }));

                            $hiddenDiv.append($loader);
                        }
                    });
                },
                minLength: 2,
                search: function() {
                    $form.append($loader);
                },
                select: function(event, ui) {
                    window.location = that.promoteUrlSchema.replace('0', ui.item.id);
                }
            });
        },

        formatItem: function(item){
            return item.identity+' ('+item.email+')';
        }
    };

    return object;
}();

OpenMiamMiam.SuperProducerAutocomplete = function() {
    var object = function(initial_owner, search_user_url){
        this.initial_owner = initial_owner;
        this.search_user_url = search_user_url;
    };

    object.prototype = {
        handleAutocomplete: function(){
            var that = this;

            var $ownerField = $('#open_miam_miam_super_producer_owner');

            var $input = $('<input type="text" class="form-control" />');

            var $hiddenDiv = $('<div style="display: none"></div>');
            var $loader = $('<img src="/bundles/isicsopenmiammiam/img/loader.gif" class="loader"/>');

            $ownerField.after($input).hide();

            $input.autocomplete({
                source: function(request, response) {
                    $.ajax({
                        url: that.search_user_url,
                        dataType: 'json',
                        data: {
                            term: $input.val()
                        },
                        success: function(data) {
                            response($.map(data, function(item) {
                                return $.extend(item, {
                                    label: that.formatItem(item)
                                });
                            }));

                            $hiddenDiv.append($loader);
                        }
                    });
                },
                minLength: 2,
                search: function() {
                    $input.parent().append($loader);
                },
                select: function(event, ui) {
                    $ownerField.val(ui.item.email);
                }
            });

            if (this.initial_owner) {
                $input.val(this.formatItem(this.initial_owner));
            }
        },

        formatItem: function(item){
            return item.identity+' ('+item.email+')';
        }
    };

    return object;
}();

OpenMiamMiam.AllocatePaymentManager = function(){
    var object = function(){
        this.$form = $('.allocate-payment-table').parents('form:first');

        this.$newPaymentContainer = this.$form.find('.new-payment');

        this.$newPaymentAmountField = this.$newPaymentContainer.find(':input[name*="[amount]"]');

        this.$newPaymentFields = this.$newPaymentContainer.find(':input');

        this.$salesOrderRows = this.$form.find('table.sales-orders tr');

        this.oldPaymentValue = this.$newPaymentAmountField.val();

        this.initialize();
    };

    object.prototype = {
        initialize: function(){
            var that = this;

            var $tdContainer = this.$newPaymentContainer.find('td.checkbox');

            if ($tdContainer.size() > 0){

                var $checkbox = $('<input type="checkbox" checked="checked" />');

                $checkbox.click(function(){
                    if ($(this).is(':checked')){
                        that.$newPaymentFields.removeAttr('disabled');
                        that.$newPaymentAmountField.val(that.oldPaymentValue);
                    }
                    else {
                        that.$newPaymentFields.attr('disabled', 'disabled');
                        that.oldPaymentValue = that.$newPaymentAmountField.val();
                        that.$newPaymentAmountField.val(0);
                    }
                });

                $tdContainer.append($checkbox);
            }

            if (this.$salesOrderRows.size() == 1) {
                this.$salesOrderRows.find('td.checkbox').hide();
            }
        }
    };

    return object;
}();

OpenMiamMiam.AllocatePaymentModal = function(){
    var object = function(container, reloadContainerUrl, formUrl, manageButton){
        this.$container = $(container);
        this.reloadContainerUrl = reloadContainerUrl;
        this.formUrl = formUrl;
        this.$manageButton= manageButton;

        this.$dialog = $('#manage-payments-dialog');

        this.initialize();
    };

    object.prototype = {
        initialize: function(){
            var clickFunction = function(e){
                e.preventDefault();

                $.ajax({
                    url: this.formUrl,
                    type: 'get',
                    success: function(html){
                        this.onPaymentFormSubmit(html);
                        this.$dialog.modal('show');
                    }.bind(this)
                });
            }.bind(this);

            if (undefined !== this.$manageButton) {
                this.$manageButton.click(clickFunction);
            }
            else {
                this.$container.on('click', 'a.manage', clickFunction);
            }
        },

        onPaymentFormSubmit: function(html) {
            var that = this;

            this.$dialog.html(html);
            var $form = this.$dialog.find('form');
            this.$dialog.find('.modal-footer :submit')
                .click(function(e){
                    e.preventDefault();

                    $form.submit();
                });
            this.$dialog.find('.modal-footer .cancel')
                .click(function(e){
                    e.preventDefault();

                    this.$dialog.modal('hide');
                }.bind(this));

            new OpenMiamMiam.AllocatePaymentManager();

            this.$dialog.find('form').submit(function(e){
                e.preventDefault();

                var form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    type: form.attr('method'),
                    data: form.serialize(),
                    success: function(html){
                        this.$dialog.modal('hide');
                        this.reloadContainer();
                    }.bind(that),
                    error: function(xhr){
                        this.onPaymentFormSubmit(xhr.responseText);
                    }.bind(that)
                });
            });
        },

        reloadContainer: function(){
            $.ajax({
                url: this.reloadContainerUrl,
                type: 'get',
                success: function(html){
                    this.$container.html(html);
                }.bind(this)
            });
        }
    };

    return object;
}();

OpenMiamMiam.ConsumerComment = function() {

    var onAddFormSubmit = function(form, consumerComment) {
        $.ajax({
            url:  form.attr('action'),
            type: form.attr('method'),
            data: form.serialize(),
            beforeSend: function() {
                form.find(':input:not(:submit)').val('');
            },
            success: function() {
                consumerComment.refreshList();
            },
            error: function(xhr){
                alert(xhr.responseText);
            }
        });
    };

    var onProcessButtonClick = function($button, consumerComment) {
        $.ajax({
            url: $button.attr('href'),
            type: 'get',
            success: function() {
                consumerComment.refreshList();
            },
            error: function(xhr) {
                alert(xhr.responseText);
            }
        })
    };

    var object = function(listContainer, refreshUrl){
        this.$listContainer = null;
        this.$addForm = null;
        this.refreshUrl = refreshUrl;
        this.loader = $('<img class="loader" src="/bundles/isicsopenmiammiam/img/loader.gif" alt="Chargement..." />');

        this.setListContainer(listContainer);

        this.initialize();
    };

    object.prototype = {
        initialize: function() {
            this.addEventsListeners();
        },

        setListContainer: function(listContainer) {
            this.$listContainer = $(listContainer);
            this.$addForm = this.$listContainer.find('.association-consumer-comment-add-form');
        },

        addEventsListeners: function() {
            var that = this;

            this.$addForm.submit(function(event){
                event.preventDefault();

                onAddFormSubmit($(this), that);
            });

            this.$listContainer.find('.association-consumer-comment-process').click(function(event){
                event.preventDefault();

                onProcessButtonClick($(this), that);
            });
        },

        refreshList: function() {
            var that = this;

            $.ajax({
                url: that.refreshUrl,
                type: 'get',
                beforeSend: function(){
                    that.$listContainer.children().not(that.$addForm).remove();
                    that.$addForm.append(that.loader.clone());
                },
                success: function(response){
                    var $newListContainer = $(response);

                    that.$listContainer.replaceWith($newListContainer);

                    that.setListContainer($newListContainer);

                    that.addEventsListeners();
                },
                error: function(xhr){
                    // Show to user
                   console.log(xhr.responseText);
                }
            });
        }
    };

    return object;
}();
