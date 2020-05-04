import csv

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.forms import Form, FileField
from products.models import *

MEDIA_PATH = '\\products\\'

class CsvImportForm(Form):
    csv_file = FileField()

@login_required
def import_products(request):
    total_rows = 0
    total_ok = 0
    total_error = 0
    error_detail = []

    if request.method == "POST":
        csv_file = request.FILES["csv_file"]

        for row in csv.DictReader(csv_file.read().decode("utf-8").splitlines()):
            total_rows = total_rows + 1
            row_ok = True

            business_unit_name = row['UNIDAD DE NEGOCIO'].capitalize().strip()

            if business_unit_name:
                try:
                    try:
                        business_unit = Business_Unit.objects.get(name__iexact=business_unit_name)
                    except:
                        business_unit = Business_Unit(name=business_unit_name)
                        business_unit.save()

                    try:
                        classification_name = row['CLASIFICACION'].capitalize().strip()
                    except:
                        raise Exception("La columna CLASIFICACION no existe")

                    try:
                        classification = Classification.objects.get(name__iexact=classification_name)
                    except:
                        classification = Classification(
                            name=classification_name
                        )
                        classification.save()

                    try:
                        category_name = row['RUBRO'].capitalize().strip()
                    except:
                        raise Exception("La columna RUBRO no existe")

                    try:
                        category = Category.objects.get(name__iexact=category_name)
                    except:
                        category = Category(
                            name=category_name
                        )
                        category.save()

                    try:
                        brand_name = row['DESC_MARCA'].capitalize().strip()
                    except:
                        raise Exception("La columna DESC_MARCA no existe")

                    try:
                        brand = Brand.objects.get(name__iexact=brand_name)
                    except:
                        brand = Brand(name=brand_name)
                        brand.save()

                    product_type_code = row['COD_LISPRE'].upper().strip()
                    photo_file = ''
                    try:
                        photo_file = MEDIA_PATH + row['FOTO'].strip()
                    except:
                        photo_file = ''

                    try:
                        product_type = Product_Type.objects.get(code__iexact=product_type_code)
                        if photo_file and not product_type.photo:
                            product_type.photo = photo_file
                            product_type.save()
                    except:
                        if photo_file:
                            product_type = Product_Type(
                                code=product_type_code,
                                brand = brand,
                                photo = photo_file
                            )
                        else:
                            product_type = Product_Type(
                                code=product_type_code,
                                brand = brand
                            )
                        product_type.save()

                    product_code = row['CODIGO'].upper().strip()
                    description = row['DETALLE'].upper().strip()
                    # wholesale_price_str = row['PRECIO'].upper().strip()

                    try:
                        product = Product.objects.get(product_code__iexact=product_code)
                        print('Product already exist = ' + product_code)
                    except:
                        product = Product(
                            description = description,
                            status = 'A',
                            # wholesale_price = 0,
                            product_type = product_type,
                            product_code = product_code,
                            business_unit = business_unit,
                            classification = classification,
                            category = category
                        )
                        product.save()
                except Exception as e:
                    row_ok = False
                    product_code = row['CODIGO'].upper().strip()
                    row_info = {
                        "source_row": product_code,
                        "error_message": "Error {0}".format(e)
                    }
                    error_detail.append(row_info)

            if row_ok:
                total_ok = total_ok + 1
            else:
                total_error = total_error + 1

        form = CsvImportForm()
        payload = {
            "form": form,
            "total_rows": total_rows,
            "error": total_error,
            "ok": total_ok,
            "error_detail": error_detail
        }
    else:
        form = CsvImportForm()
        payload = {"form": form}

    return render(
            request, "products/import_csv_products.html", payload
        )