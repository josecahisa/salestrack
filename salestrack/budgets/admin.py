from django.contrib import admin

from budgets.models import Shipping
from budgets.models import PaymentTerm
from budgets.models import Budget
from budgets.models import BudgetDetail
from django import forms

admin.site.register(Shipping)
admin.site.register(PaymentTerm)

class BudgetAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(BudgetAdminForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Budget
        fields = [
            'date',
            'numero',
            'client',
            'delivery_address',
            'paymentTerm',
            'shipping',
            'status',
            'discount'
        ]

        labels = {
            'date': 'Date',
            'numero': 'Número',
            'client': 'Cliente',
            'delivery_address': 'Dirección de Entrega',
            'paymentTerm': 'Forma de Pago',
            'shipping': 'Transporte',
            'status': 'Estado',
            'discount': 'Descuento'
        }


class BudgetDetailAdminInline(admin.TabularInline):
    model = BudgetDetail
    extra = 0

    # Remove Add / update / Delete icons from the inline Form
    def formfield_for_dbfield(self, db_field, request, **kwargs):
        formfield = super(BudgetDetailAdminInline, self).formfield_for_dbfield(
            db_field, request, **kwargs)
        if db_field.name == 'budget':
            formfield.widget.can_add_related = False
            formfield.widget.can_change_related = False
            formfield.widget.can_delete_related = False
        return formfield


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    form = BudgetAdminForm

    list_display = ['numero', 'date', 'client', 'shipping', 'status', 'discount']
    list_display_links = ['numero', 'date']
    list_editable = ('status', )
    ordering = ['date']
    search_fields = [ 'client__name']
    list_filter = ('status',)

    inlines = [BudgetDetailAdminInline]

    fieldsets = (
        ('Presupuesto', {
            'fields': (
                ('numero', 'date', 'status'),

            )
        }),
        ('Cliente', {
            'fields' : (
                ('client', 'delivery_address'),
            )
        }),
        ('Condiciones', {
            'fields' : (
                ('shipping', 'paymentTerm', 'discount'),
                'delivery_city'
            )
        }),
    )